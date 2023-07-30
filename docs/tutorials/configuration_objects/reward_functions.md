# Reward Functions

A `RewardFunction` is an object used by RLGym to compute the reward for each action every step.

All reward functions must implement the following three methods:

```python
#Called every reset.
reset(self, initial_state: GameState)

#Called every step.
get_reward(self, player: PlayerData, state: GameState, previous_action: np.ndarray) -> float

#Called if the current state is terminal.
get_final_reward(self, player: PlayerData, state: GameState, previous_action: np.ndarray) -> float
```

These methods are called by an RLGym environment during an episode.

To make a custom reward function, just inherit from the base class and implement the above methods.
As an example, let's create a simple reward function that will reward the agent for gaining speed.

```python
from rlgym.utils.reward_functions import RewardFunction
from rlgym.utils import math
from rlgym.utils.gamestates import GameState, PlayerData
import numpy as np


class SpeedReward(RewardFunction):
  def reset(self, initial_state: GameState):
    pass

  def get_reward(self, player: PlayerData, state: GameState, previous_action: np.ndarray) -> float:
    linear_velocity = player.car_data.linear_velocity
    reward = math.vecmag(linear_velocity)

    return reward

  def get_final_reward(self, player: PlayerData, state: GameState, previous_action: np.ndarray) -> float:
    return 0
```

Now we can simply pass an instance of our reward function to RLGym when we make an environment.

```python
import rlgym


env = rlgym.make(reward_fn=SpeedReward())
#Training loop goes here
```

And we're off to the races!
