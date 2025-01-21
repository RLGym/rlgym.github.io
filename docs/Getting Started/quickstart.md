---
title: Quick Start Guide
sidebar_position: 3
---

# Quick Start Guide

Let's get you started with RLGym by installing it with RocketSim and training a basic Rocket League agent using RLGym-PPO. We'll set up a training environment, configure a learner, and get training. We'll use default settings here, but you can adjust these later to tune how your agent learns.

## Installation

First, let's get RLGym with RocketSim support and install RLGym-PPO:

```bash
pip install rlgym[rl-sim]
pip install git+https://github.com/AechPro/rlgym-ppo
```

If you have an NVIDIA GPU, grab PyTorch with CUDA support from [pytorch.org](https://pytorch.org) to speed up training.

## Training Your First Agent

Now we'll set up a 2v2 rocket league environment with standard kickoff positions. The environment will tell the agent what's happening in the game and reward it for scoring goals and touching the ball. While normal matches last 5 minutes, we'll add a 30-second timeout if the agent doesn't touch the ball - this helps avoid wasting time on unproductive training episodes.

The code below configures the 2v2 environment and initializes training using Proximal Policy Optimization (PPO):

```python
def build_rlgym_v2_env():
    from rlgym.api import RLGym
    from rlgym.rocket_league.action_parsers import LookupTableAction, RepeatAction
    from rlgym.rocket_league.done_conditions import GoalCondition, NoTouchTimeoutCondition, TimeoutCondition, AnyCondition
    from rlgym.rocket_league.obs_builders import DefaultObs
    from rlgym.rocket_league.reward_functions import CombinedReward, GoalReward, TouchReward
    from rlgym.rocket_league.sim import RocketSimEngine
    from rlgym.rocket_league.state_mutators import MutatorSequence, FixedTeamSizeMutator, KickoffMutator
    from rlgym.rocket_league import common_values
    from rlgym_ppo.util import RLGymV2GymWrapper
    import numpy as np

    spawn_opponents = True
    team_size = 2
    blue_team_size = team_size
    orange_team_size = team_size if spawn_opponents else 0
    action_repeat = 8
    no_touch_timeout_seconds = 30
    game_timeout_seconds = 300

    action_parser = RepeatAction(LookupTableAction(), repeats=action_repeat)
    termination_condition = GoalCondition()
    truncation_condition = AnyCondition(NoTouchTimeoutCondition(timeout_seconds=no_touch_timeout_seconds), TimeoutCondition(timeout_seconds=game_timeout_seconds))

    reward_fn = CombinedReward((GoalReward(), 10), (TouchReward(), 0.1))

    obs_builder = DefaultObs(zero_padding=None,
                             pos_coef=np.asarray([1 / common_values.SIDE_WALL_X, 1 / common_values.BACK_NET_Y, 1 / common_values.CEILING_Z]),
                             ang_coef=1 / np.pi,
                             lin_vel_coef=1 / common_values.CAR_MAX_SPEED,
                             ang_vel_coef=1 / common_values.CAR_MAX_ANG_VEL,
                             boost_coef=1 / 100.0,)

    state_mutator = MutatorSequence(FixedTeamSizeMutator(blue_size=blue_team_size, orange_size=orange_team_size),
                                    KickoffMutator())
    rlgym_env = RLGym(
        state_mutator=state_mutator,
        obs_builder=obs_builder,
        action_parser=action_parser,
        reward_fn=reward_fn,
        termination_cond=termination_condition,
        truncation_cond=truncation_condition,
        transition_engine=RocketSimEngine())

    return RLGymV2GymWrapper(rlgym_env)


if __name__ == "__main__":
    from rlgym_ppo import Learner

    # 8 processes
    n_proc = 8

    # educated guess - could be slightly higher or lower
    min_inference_size = max(1, int(round(n_proc * 0.9)))

    learner = Learner(build_rlgym_v2_env,
                      n_proc=n_proc,
                      min_inference_size=min_inference_size,
                      metrics_logger=None,
                      ppo_batch_size=50000, # batch size - set this number to as large as your GPU can handle
                      policy_layer_sizes=[512, 512], # policy network
                      critic_layer_sizes=[512, 512], # value network
                      ts_per_iteration=50000, # timesteps per training iteration - set this equal to the batch size
                      exp_buffer_size=150000, # size of experience buffer - keep this 2 - 3x the batch size
                      ppo_minibatch_size=50000, # minibatch size - set this less than or equal to the batch size
                      ppo_ent_coef=0.01, # entropy coefficient - this determines the impact of exploration on the policy
                      policy_lr=5e-5, # policy learning rate
                      critic_lr=5e-5, # value function learning rate
                      ppo_epochs=1,   # number of PPO epochs
                      standardize_returns=True,
                      standardize_obs=False,
                      save_every_ts=1_000_000, # save every 1M steps
                      timestep_limit=1_000_000_000, # Train for 1B steps
                      log_to_wandb=True)
    learner.learn()
```

For a more complete guide to training your first agent, refer to our Rocket League tutorial on [training an agent](../Rocket%20League/training_an_agent).
