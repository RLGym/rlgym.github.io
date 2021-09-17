## Extra Rewards

`rlgym-tools` comes with a number of potentially useful reward functions which are not packaged directly with RLGym. Here we will provide a brief summary of each reward function and how to use it.

### AnnealRewards

If we're interested in training an agent to accomplish some task by mastering increasingly complex reward functions (as in [curriculum learning](https://jmlr.org/papers/volume21/20-212/20-212.pdf)), we may want to smoothly transition from one reward function to the next. AnnealRewards does this by weighting the current reward stage with the next one as `y*current_reward + (1 - y)*current_reward` where `y = counter / max_count`. The counter used here can be specified through one of three modes: `STEP`, `TOUCH`, and `GOAL`. At each call to `AnnealRewards.get_reward()`, the counter is incremented based on the mode provided. The `STEP` mode will cause the counter to be incremented by 1 at every call to `get_reward`, the `TOUCH` mode will increment the counter every time the player touches the ball, and the `GOAL` mode will increment the counter every time the player scores a goal.

To specify the max number of steps that each reward function should be present for, just pass the value as an `int` to the `AnnealRewards` constructor in a list with the `RewardFunction` objects. Let's look at an example where we set up an `AnnealRewards` object to  smoothly transition the reward function from `VelocityReward` to `VelocityPlayerToBallReward`.

```python

import rlgym
from rlgym_tools.extra_rewards import AnnealRewards
from rlgym.utils.reward_functions.common_rewards import VelocityReward, VelocityPlayerToBallReward

# These are arbitrary values that may not result in a good model.
vel_max_steps = 100_000
vel_to_ball_max_steps = 100_000

reward1 = VelocityReward()
reward2 = VelocityPlayerToBallReward()

alternating_rewards_steps = [reward1, vel_max_steps, reward2, vel_to_ball_max_steps]

anneal_reward = AnnealRewards(alternating_rewards_steps, mode=AnnealRewards.STEP)

env = rlgym.make(reward_fn=anneal_reward)
```

### DiffReward

This simple function will return the difference in reward between time steps (e.g. reward_at_t1 - reward_at_t0). This may be useful if we're interested in rewarding the agent for its acceleration, rather than velocity.

Example:
```python
import rlgym
from rlgym_tools.extra_rewards import DiffReward
from rlgym.utils.reward_functions.common_rewards import VelocityReward

vel_reward = VelocityReward()
accel_reward = DiffReward(vel_reward)

env = rlgym.make(reward_fn=accel_reward)
```

### DistributeRewards

This reward is similar to the method used by OpenAI Five to distribute the credit of a reward during a team game across the agents in the match. Read Appendix G from [their paper](https://arxiv.org/pdf/1912.06680.pdf) to learn more.

Example:
```python
import rlgym
from rlgym_tools.extra_rewards import DistributeRewards
from rlgym.utils.reward_functions.common_rewards import EventReward

goal_reward = EventReward(goal=1, concede=-1)
distrib_reward = DistributeRewards(goal_reward, team_spirit=0.3)

env = rlgym.make(reward_fn=distrib_reward)
```

### MultiplyRewards

As the name implies, this will take any number of reward functions and return their product at each timestep.

Example:
```python
import rlgym
from rlgym_tools.extra_rewards import MultiplyRewards
from rlgym.utils.reward_functions.common_rewards import EventReward, VelocityPlayerToBallReward

touch_reward = EventReward(touch=1)
velocity_to_ball_reward = VelocityPlayerToBallReward()

rewards = [touch_reward, velocity_to_ball_reward]
multiply_reward = MultiplyRewards(rewards)

env = rlgym.make(reward_fn=multiply_reward)
```