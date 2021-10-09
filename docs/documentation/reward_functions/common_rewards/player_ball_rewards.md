# Player Ball Rewards

Reward functions that measure relationships between the agent and the ball.

## [Liu Distance Player To Ball Reward](https://github.com/lucas-emery/rocket-league-gym/blob/7f07bfa980b84eea11627939dd7d7b1689efcfa7/rlgym/utils/reward_functions/common_rewards/player_ball_rewards.py#L8)

Returns exponentially higher reward the closer the agent is to the ball. This is equivalent to `LiuDistanceBallToGoalReward`.

```python
LiuDistancePlayerToBallReward
```

```python
from rlgym.utils.reward_functions.player_ball_rewards import LiuDistancePlayerToBallReward

liu_distance_player_ball_reward = LiuDistancePlayerToBallReward()
```

## [Velocity Player To Ball Reward](https://github.com/lucas-emery/rocket-league-gym/blob/7f07bfa980b84eea11627939dd7d7b1689efcfa7/rlgym/utils/reward_functions/common_rewards/player_ball_rewards.py#L18)

Returns the scalar projection of the agent's velocity vector on to the ball's position vector.

```python
VelocityPlayerToBallReward(use_scalar_projection=False)
```

```python
from rlgym.utils.reward_functions.player_ball_rewards import VelocityPlayerToBallReward

velocity_player_ball_reward = VelocityPlayerToBallReward()
```

## [Face Ball Reward](https://github.com/lucas-emery/rocket-league-gym/blob/7f07bfa980b84eea11627939dd7d7b1689efcfa7/rlgym/utils/reward_functions/common_rewards/player_ball_rewards.py#L42)

Returns positive reward scaled by the angle between the nose of the agent's car and the ball.

```python
FaceBallReward()
```

```python
from rlgym.utils.reward_functions.player_ball_rewards import FaceBallReward

face_ball_reward = FaceBallReward()
```

## [Touch Ball Reward](https://github.com/lucas-emery/rocket-league-gym/blob/7f07bfa980b84eea11627939dd7d7b1689efcfa7/rlgym/utils/reward_functions/common_rewards/player_ball_rewards.py#L52)

Returns positive reward every time the agent touches the ball with an optional scaling factor for how high the ball was in the air when touched.

```python
TouchBallReward(aerial_weight=0.)
```

```python
from rlgym.utils.reward_functions.player_ball_rewards import TouchBallReward

touch_ball_reward = TouchBallReward()
```
