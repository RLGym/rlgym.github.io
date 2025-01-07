---
title: Training an Agent
sidebar_position: 1
---

# Training an Agent

This guide will walk you through training a Rocket League bot using RLGym and the PPOLearner from RLGym Learn. We'll use RocketSim to avoid running the actual game, and cover the essential concepts you need to understand. We'll be jumping off from the end of our [Quick Start Guide](../Getting%20Started/quickstart), so make sure you've read that first.


## A Better Agent

This tutorial is taken from the wonderful tutorial written by Zealan, the creator of RocketSim, and adapted for RLGym v2. Please check out the [original tutorial](https://github.com/ZealanL/RLGym-PPO-Guide/tree/main) for more details.

Now that we've covered the basics, lets dive into a more complicated agent training setup. First, we'll create a better environment where the agent receives a richer reward signal. Next, we'll set all of the hyperparameters in the learner to some reasonable values instead of the defaults. Finally, we'll configure the environment to use a visualizer so we can watch the agent learn as it plays.

```python
from typing import List, Dict, Any
from rlgym.api import RewardFunction
from rlgym.rocket_league.api import GameState, AgentID
from rlgym.rocket_league import common_values
import numpy as np

class SpeedTowardBallReward(RewardFunction[AgentID, GameState, float]):
    """Rewards the agent for moving quickly toward the ball"""
    
    def reset(self, agents: List[AgentID], initial_state: GameState, shared_info: Dict[str, Any]) -> None:
        pass
    
    def get_rewards(self, agents: List[AgentID], state: GameState, is_terminated: Dict[AgentID, bool],
                    is_truncated: Dict[AgentID, bool], shared_info: Dict[str, Any]) -> Dict[AgentID, float]:
        rewards = {}
        for agent in agents:
            car = state.cars[agent]
            car_physics = car.physics if car.is_orange else car.inverted_physics
            ball_physics = state.ball if car.is_orange else state.inverted_ball
            player_vel = car_physics.linear_velocity
            pos_diff = (ball_physics.position - car_physics.position)
            dist_to_ball = np.linalg.norm(pos_diff)
            dir_to_ball = pos_diff / dist_to_ball

            speed_toward_ball = np.dot(player_vel, dir_to_ball)

            rewards[agent] = max(speed_toward_ball / common_values.CAR_MAX_SPEED, 0.0)
        return rewards

class InAirReward(RewardFunction[AgentID, GameState, float]):
    """Rewards the agent for being in the air"""
    
    def reset(self, agents: List[AgentID], initial_state: GameState, shared_info: Dict[str, Any]) -> None:
        pass
    
    def get_rewards(self, agents: List[AgentID], state: GameState, is_terminated: Dict[AgentID, bool],
                    is_truncated: Dict[AgentID, bool], shared_info: Dict[str, Any]) -> Dict[AgentID, float]:
        return {agent: float(not state.cars[agent].on_ground) for agent in agents}

class VelocityBallToGoalReward(RewardFunction[AgentID, GameState, float]):
    """Rewards the agent for hitting the ball toward the opponent's goal"""
    
    def reset(self, agents: List[AgentID], initial_state: GameState, shared_info: Dict[str, Any]) -> None:
        pass
    
    def get_rewards(self, agents: List[AgentID], state: GameState, is_terminated: Dict[AgentID, bool],
                    is_truncated: Dict[AgentID, bool], shared_info: Dict[str, Any]) -> Dict[AgentID, float]:
        rewards = {}
        for agent in agents:
            car = state.cars[agent]
            if car.is_orange:
                ball = state.ball
                goal_y = common_values.BACK_NET_Y
            else:
                ball = state.inverted_ball
                goal_y = -common_values.BACK_NET_Y

            ball_vel = ball.linear_velocity
            pos_diff = np.array([0, goal_y, 0]) - ball.position
            dist = np.linalg.norm(pos_diff)
            dir_to_goal = pos_diff / dist
            
            vel_toward_goal = np.dot(ball_vel, dir_to_goal)
            rewards[agent] = max(vel_toward_goal / common_values.BALL_MAX_SPEED, 0)
        return rewards

def build_rlgym_v2_env():
    from rlgym.api import RLGym
    from rlgym.rocket_league.action_parsers import LookupTableAction, RepeatAction
    from rlgym.rocket_league.done_conditions import GoalCondition, NoTouchTimeoutCondition, TimeoutCondition, AnyCondition
    from rlgym.rocket_league.obs_builders import DefaultObs
    from rlgym.rocket_league.reward_functions import CombinedReward, GoalReward
    from rlgym.rocket_league.sim import RocketSimEngine
    from rlgym.rocket_league.state_mutators import MutatorSequence, FixedTeamSizeMutator, KickoffMutator
    from rlgym.rocket_league import common_values
    from rlgym_ppo.util import RLGymV2GymWrapper

    spawn_opponents = True
    team_size = 1
    blue_team_size = team_size
    orange_team_size = team_size if spawn_opponents else 0
    action_repeat = 8
    no_touch_timeout_seconds = 30
    game_timeout_seconds = 300

    action_parser = RepeatAction(LookupTableAction(), repeats=action_repeat)
    termination_condition = GoalCondition()
    truncation_condition = AnyCondition(
        NoTouchTimeoutCondition(timeout_seconds=no_touch_timeout_seconds),
        TimeoutCondition(timeout_seconds=game_timeout_seconds)
    )

    reward_fn = CombinedReward(
        (InAirReward(), 0.002),
        (SpeedTowardBallReward(), 0.01),
        (VelocityBallToGoalReward(), 0.1),
        (GoalReward(), 10.0)
    )

    obs_builder = DefaultObs(zero_padding=None,
                           pos_coef=np.asarray([1 / common_values.SIDE_WALL_X, 
                                              1 / common_values.BACK_NET_Y, 
                                              1 / common_values.CEILING_Z]),
                           ang_coef=1 / np.pi,
                           lin_vel_coef=1 / common_values.CAR_MAX_SPEED,
                           ang_vel_coef=1 / common_values.CAR_MAX_ANG_VEL,
                           boost_coef=1 / 100.0)

    state_mutator = MutatorSequence(
        FixedTeamSizeMutator(blue_size=blue_team_size, orange_size=orange_team_size),
        KickoffMutator()
    )

    rlgym_env = RLGym(
        state_mutator=state_mutator,
        obs_builder=obs_builder,
        action_parser=action_parser,
        reward_fn=reward_fn,
        termination_cond=termination_condition,
        truncation_cond=truncation_condition,
        transition_engine=RocketSimEngine()
    )

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
                      ppo_batch_size=100_000,  # batch size - much higher than 300K doesn't seem to help most people
                      policy_layer_sizes=[2048, 2048, 1024, 1024],  # policy network
                      critic_layer_sizes=[2048, 2048, 1024, 1024],  # critic network
                      ts_per_iteration=100_000,  # timesteps per training iteration - set this equal to the batch size
                      exp_buffer_size=300_000,  # size of experience buffer - keep this 2 - 3x the batch size
                      ppo_minibatch_size=100_000,  # minibatch size - set this as high as your GPU can handle
                      ppo_ent_coef=0.01,  # entropy coefficient - this determines the impact of exploration
                      policy_lr=1e-4,  # policy learning rate
                      critic_lr=1e-4,  # critic learning rate
                      ppo_epochs=2,   # number of PPO epochs
                      standardize_returns=True,
                      standardize_obs=False,
                      save_every_ts=1_000_000,  # save every 1M steps
                      timestep_limit=1_000_000_000,  # Train for 1B steps
                      log_to_wandb=True)
    learner.learn()
```

## Understanding the Training Process

With PPO, training happens in cycles. First, the agent collects experience in the game and then PPO uses that experience to improve the agent. During this phase the bot plays games in RocketSim, trying different actions to gather experience. Each time the bot takes an action the game advances 8 physics ticks, and the environment returns a reward and observation. We call this a *timestep*. After collecting a certain number of timesteps PPO uses all the collected experience to improve the agent's neural network, making it more likely to repeat actions that led to high rewards and less likely to repeat actions that led to low rewards. We call one of these training cycles an *iteration*.

After each iteration, you will see some information displayed in the console about what happened since the last iteration. These metrics include important information about the training process, such as:
- **Policy Reward**: Average reward per episode (higher is better)
- **Policy Entropy**: How much the policy is exploring (this should settle around a positive number like 2)
- **Collected Steps Per Second**: How many timesteps are being collected per second (higher is better)
- **Consumed Steps Per Second**: How many timesteps are being consumed per second (higher is better)
- **Value Loss**: How well the bot predicts future rewards (lower is better)
- **Total Steps**: How many timesteps the bot has collected


## Monitoring Progress
RLGym-PPO has integrated support for [Weights & Biases](https://wandb.ai) (wandb) for tracking training metrics. Once you set up an account with wandb, set the `log_to_wandb` parameter to `True` in the `Learner` constructor. Then you can view your training progress in the web interface. You'll see graphs of rewards, losses, and other statistics that help you understand how your bot is improving.
