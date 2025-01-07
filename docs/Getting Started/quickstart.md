---
title: Quick Start Guide
sidebar_position: 3
---

# Quick Start Guide

In this guide we'll install RLGym with RocketSim and train a simple Rocket League bot with an algorithm from RLGym Learn. To train a bot, we will first set up an environment where it can play, then create a learner and start training. In this guide we'll use all the default settings, but you can experiment with different values to see how they affect your bot's performance. 

## Installation

Let's start by installing RLGym with RocketSim support. RocketSim is a headless simulator for Rocket League, which means your bot can train much faster than in the real game. We'll also install RLGym-PPO, which provides an implementation of PPO compatible with RLGym.

```bash
pip install rlgym[rl-sim]
pip install git+https://github.com/AechPro/rlgym-ppo
```

If you have an NVIDIA GPU, you'll also want to install PyTorch with CUDA support from [pytorch.org](https://pytorch.org).

## Training Your First Agent

Next, we'll create a Rocket League environment where our bot can train. We'll set up a 2v2 match with the typical kickoff positions, let the agent see all the relevant information from the game, and reward it for scoring goals and touching the ball. While the game will end as usual after a 5 minute timer, we're also going to add a timeout condition to end the episode if the agent doesn't touch the ball for 30 seconds. We do this because we don't want the bot to waste a bunch of time flopping around without touching the ball.

The following code will set up our simple 2v2 environment and start training our bot with the Proximal Policy Optimization (PPO) algorithm implemented in RLGym Learn.

```python
def build_rlgym_v2_env():
    from rlgym.api import RLGym
    from rlgym.rocket_league.action_parsers import LookupTableAction, RepeatAction
    from rlgym.rocket_league.done_conditions import GoalCondition, NoTouchTimeoutCondition, TimeoutCondition
    from rlgym.rocket_league.obs_builders import DefaultObs
    from rlgym.rocket_league.reward_functions import CombinedReward, GoalReward, TouchReward
    from rlgym.rocket_league.sim import RocketSimEngine
    from rlgym.rocket_league.state_mutators import MutatorSequence, FixedTeamSizeMutator, KickoffMutator
    from rlgym.rocket_league import common_values
    from rlgym_ppo.util import RLGymV2GymWrapper
    import numpy as np

    spawn_opponents = True
    team_size = 1
    blue_team_size = team_size
    orange_team_size = team_size if spawn_opponents else 0
    action_repeat = 8
    no_touch_timeout_seconds = 10
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

    # 32 processes
    n_proc = 32

    # educated guess - could be slightly higher or lower
    min_inference_size = max(1, int(round(n_proc * 0.9)))

    learner = Learner(build_rlgym_v2_env,
                      n_proc=n_proc,
                      min_inference_size=min_inference_size,
                      metrics_logger=None,
                      ppo_batch_size=50000, # batch size - set this number to as large as your GPU can handle
                      policy_layer_sizes=[2048, 2048, 1024, 1024], # policy network
                      critic_layer_sizes=[2048, 2048, 1024, 1024], # value network
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

This code will train a 2v2 bot for 1 billion timesteps (That's over 18,500 hours of in-game time!), saving checkpoints every 1 million timesteps. You can stop the training process at any time by pressing P while the program is in focus.

For a more complete guide to training your first agent, refer to our Rocket League tutorial on [training an agent](../Rocket%20League/training_an_agent).
