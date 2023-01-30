# Ball to goal rewards

Ball to goal rewards are functions that measure some relationship between the ball and the opponent's goal.

## [Liu Distance Ball To Goal Reward](https://github.com/lucas-emery/rocket-league-gym/blob/7f07bfa980b84eea11627939dd7d7b1689efcfa7/rlgym/utils/reward_functions/common_rewards/ball_goal_rewards.py#L9)

[Inspired by: From Motor Control to Team Play in Simulated Humanoid Football](https://arxiv.org/pdf/2105.12196.pdf)

```python
LiuDistanceBallToGoalReward(own_goal=False):
```

```python
from rlgym.utils.reward_functions.common_rewards import LiuDistancePlayerToBallReward

liu_distance = LiuDistancePlayerToBallReward()
```

1. Determine which team the agent is on, and set the opponent's goal as the objective.
2. Compute the normalized distance between the position of the ball, and the center of the opponent's goal.
3. Note that the point returned is in the center of the net, shifted to the back wall inside the net, such that the distance between the ball and the objective can never be zero.

    ```python
    dist = np.linalg.norm(state.ball.position - objective) - (BACK_NET_Y - BACK_WALL_Y + BALL_RADIUS)
    ```

3. Return `e^(-distance*0.5 / max_ball_speed)` $e^{\frac {- \text{distance} * 0.5} { \text{max\_ball\_speed}} }$

    ```python
    return np.exp(-0.5 * dist / BALL_MAX_SPEED)
    ```

This results in an exponential curve which is at its maximum when the ball is closest to the center of the net.

## [Velocity Ball To Goal Reward](https://github.com/lucas-emery/rocket-league-gym/blob/7f07bfa980b84eea11627939dd7d7b1689efcfa7/rlgym/utils/reward_functions/common_rewards/ball_goal_rewards.py#L29)

```python
VelocityBallToGoalReward(own_goal=False, use_scalar_projection=False)
```

```python
from rlgym.utils.reward_functions.common_rewards import VelocityBallToGoalReward

velocity_ball_goal_reward = VelocityBallToGoalReward()
```

1. Determine which team the agent is on, and set the opponent's goal as the objective.
2. Get the linear velocity of the ball.
3. Determine the difference between the objective (goal from step 1) and the current ball position.
4. Return the scalar projection of the ball's velocity vector on to the objective vector.

## [Ball Y Coordinate Reward](https://github.com/lucas-emery/rocket-league-gym/blob/7f07bfa980b84eea11627939dd7d7b1689efcfa7/rlgym/utils/reward_functions/common_rewards/ball_goal_rewards.py#L60)

```python
BallYCoordinateReward(exponent=1)
```

```python
from rlgym.utils.reward_functions.common_rewards import BallYCoordinateReward

ball_y_reward = BallYCoordinateReward()
```

Incentivize higher ball heights
