# Misc Rewards

Misc rewards :shrug:

## [Velocity Reward](https://github.com/lucas-emery/rocket-league-gym/blob/7f07bfa980b84eea11627939dd7d7b1689efcfa7/rlgym/utils/reward_functions/common_rewards/misc_rewards.py#L56)

Velocity reward is a simple reward to make sure models can be trained. The velocity reward function returns the norm of (the players velocity / (max car speed & (1 - 2 \* negative)))

```python
VelocityReward(negative=False)
```

```python
from rlgym.utils.reward_functions.misc_rewards import (
    VelocityReward()
)

velocity_reward = VelocityReward()
```

## [Save Boost Reward](https://github.com/lucas-emery/rocket-league-gym/blob/7f07bfa980b84eea11627939dd7d7b1689efcfa7/rlgym/utils/reward_functions/common_rewards/misc_rewards.py#L69)

1 reward for each frame with 100 boost, we return the sqrt of players boost because 0->20 makes bigger difference than 80->100

```python
SaveBoostReward()
```

```python
from rlgym.utils.reward_functions.misc_rewards import (
    SaveBoostReward
)

save_boost_reward = SaveBoostReward()
```

## [Constant Reward](https://github.com/lucas-emery/rocket-league-gym/blob/7f07bfa980b84eea11627939dd7d7b1689efcfa7/rlgym/utils/reward_functions/common_rewards/misc_rewards.py#L78)

Provides reward of 1 to agent every time function is called

```python
ConstantReward()
```

```python
from rlgym.utils.reward_functions.misc_rewards import (
    ConstantReward
)

constant_reward = ConstantReward()
```

## [Align Ball To Goal](https://github.com/lucas-emery/rocket-league-gym/blob/7f07bfa980b84eea11627939dd7d7b1689efcfa7/rlgym/utils/reward_functions/common_rewards/misc_rewards.py#L86)

1. Determine which team the player is on (and by extension which net we should be attacking / defending)
2. Compute defensive reward for when the player aligns the ball away from their goal
3. Computer offensive reward for when the player aligns the ball towards the opponents goal
4. Sum defensive and offensive rewards and return the total

```python
AlignBallGoal(defense=1., offense=1.)
```

```python
from rlgym.utils.reward_functions.misc_rewards import (
    AlignBallGoal
)

align_ball_to_goal = AlignBallGoal()
```
