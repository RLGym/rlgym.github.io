# Misc Rewards

Misc rewards.

## [Velocity Reward](https://github.com/lucas-emery/rocket-league-gym/blob/7f07bfa980b84eea11627939dd7d7b1689efcfa7/rlgym/utils/reward_functions/common_rewards/misc_rewards.py#L56)

Velocity reward is a simple function to make sure models can be trained.
The velocity reward function returns either the positive or negative magnitude of the agent's velocity, determined by the `negative` flag in the constructor.

```python
VelocityReward(negative=False)
```

```python
from rlgym.utils.reward_functions.misc_rewards import VelocityReward

velocity_reward = VelocityReward()
```

## [Save Boost Reward](https://github.com/lucas-emery/rocket-league-gym/blob/7f07bfa980b84eea11627939dd7d7b1689efcfa7/rlgym/utils/reward_functions/common_rewards/misc_rewards.py#L69)

Each step the agent is rewarded with `sqrt(player.boost_amount)`.
We take the square root here because, intuitively, the difference between 0 and 20 boost is more impactful on the game than the difference between 80 and 100 boost.

```python
SaveBoostReward()
```

```python
from rlgym.utils.reward_functions.misc_rewards import SaveBoostReward

save_boost_reward = SaveBoostReward()
```

## [Constant Reward](https://github.com/lucas-emery/rocket-league-gym/blob/7f07bfa980b84eea11627939dd7d7b1689efcfa7/rlgym/utils/reward_functions/common_rewards/misc_rewards.py#L78)

Provides a constant reward of 1 to agent every step.

```python
ConstantReward()
```

```python
from rlgym.utils.reward_functions.misc_rewards import ConstantReward

constant_reward = ConstantReward()
```

## [Align Ball To Goal](https://github.com/lucas-emery/rocket-league-gym/blob/7f07bfa980b84eea11627939dd7d7b1689efcfa7/rlgym/utils/reward_functions/common_rewards/misc_rewards.py#L86)

1. Determine which team the agent is on (and by extension which net we should be attacking / defending)
1. Compute defensive reward for when the agent aligns the ball away from their goal
1. Computer offensive reward for when the agent aligns the ball towards the opponents goal
1. Sum defensive and offensive rewards and return the total

```python
AlignBallGoal(defense=1., offense=1.)
```

```python
from rlgym.utils.reward_functions.misc_rewards import AlignBallGoal

align_ball_to_goal = AlignBallGoal()
```
