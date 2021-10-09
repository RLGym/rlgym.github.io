# Ball to goal rewards

Ball to goal rewards are rewards computed on some metric measuring relationships between the balls state and the position of the goal

## [Liu Distance Ball To Goal Reward](https://github.com/lucas-emery/rocket-league-gym/blob/7f07bfa980b84eea11627939dd7d7b1689efcfa7/rlgym/utils/reward_functions/common_rewards/ball_goal_rewards.py#L9)

[Inspired by: From Motor Control to Team Play in Simulated Humanoid Football](https://arxiv.org/pdf/2105.12196.pdf)

```python
LiuDistanceBallToGoalReward(own_goal=False):
```

```python
from rlgym.utils.reward_functions.common_rewards import (
    LiuDistancePlayerToBallReward,
)

liu_distance = LiuDistancePlayerToBallReward()
```

1. Initializes by checking which team the player is on to direct which goal is our objective
2. Computes a normalized distance between the balls current position, and the position of the objective goal, subtracted by (height of back of net - back wall of net height + ball radius)

```python
dist = np.linalg.norm(state.ball.position - objective) - (BACK_NET_Y - BACK_WALL_Y + BALL_RADIUS)
```

3. returns distance raised to distance \*\* (-0.5 / max ball speed)

```python
return np.exp(-0.5 * dist / BALL_MAX_SPEED)
```

this helps to the reward get larger as the distance between ball and goal gets smaller

## [Velocity Ball To Goal Reward](https://github.com/lucas-emery/rocket-league-gym/blob/7f07bfa980b84eea11627939dd7d7b1689efcfa7/rlgym/utils/reward_functions/common_rewards/ball_goal_rewards.py#L29)

```python
VelocityBallToGoalReward(own_goal=False, use_scalar_projection=False)
```

```python
from rlgym.utils.reward_functions.common_rewards import (
    VelocityBallToGoalReward
)

velocity_ball_goal_reward = VelocityBallToGoalReward()
```

1. Initializes by checking which team the player is on to direct which goal is our objective
2. Gets the linear velocity of the ball
3. Determines difference between objective (goal from step 1) and current ball position
4. IF use_scalar_projection
    1. Compute scalar projection between velocity of ball and positio difference
5. ELSE
    1. Compute normalized position difference between position difference computed in step 3 divided by the normalized position difference from step 3
    2. Divide velocity by max ball speed
    3. return the dot produce of the normalized position diff and the normalized velocity

## [Ball Y Coordinate Reward](https://github.com/lucas-emery/rocket-league-gym/blob/7f07bfa980b84eea11627939dd7d7b1689efcfa7/rlgym/utils/reward_functions/common_rewards/ball_goal_rewards.py#L60)

```python
BallYCoordinateReward(exponent=1)
```

```python
from rlgym.utils.reward_functions.common_rewards import (
    BallYCoordinateReward
)

ball_y_reward = BallYCoordinateReward()
```

Incentivize higher ball heights
