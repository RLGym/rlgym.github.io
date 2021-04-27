## Reward Functions
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

To make a custom reward function, simply inherit from the base class and implement the above methods.
As an example, let's create a simple reward function that will reward the agent for gaining speed

```python
from rlgym.utils.reward_functions import RewardFunction
from rlgym.utils import math


class SpeedReward(RewardFunction):
  def reset(self, initial_state: GameState):
    pass

  def get_reward(self, player: PlayerData, state: GameState, previous_action: np.ndarray) -> float:
    linear_velocity = player.car_data.linear_velocity
    reward = math.vec_mag(linear_velocity)
    
    return reward
    
  def get_final_reward(self, player: PlayerData, state: GameState, previous_action: np.ndarray) -> float:
    return 0
```
Now we can simply pass an instance of our reward function to RLGym when we make an environment
```
import rlgym


env = rlgym.make("default",
                 reward_fn=SpeedReward())
```
And we're off to the races!

Note how each of the reward computation functions must accept a `PlayerData` object as an argument. This is because RLGym supports multi-agent play for 1v1, 2v2, and 3v3. Your reward function will be called once per step for *each player* in the game, so if you want to assign different rewards to specific players, you will need to keep track of what player is currently being assigned a reward.

To illustrate this, let's look at what happens when we add more players to the game with our reward function.

First, we will make a simple modification to the `get_reward` function that will print out what player it was called with:
```python
def get_reward(self, player: PlayerData, state: GameState, previous_action: np.ndarray) -> float:
    linear_velocity = player.car_data.linear_velocity
    reward = math.vec_mag(linear_velocity)
    
    print("Rewarding player ID {}".format(player.car_id))
    
    return reward
```

Next, let's set up an agent in a 1v1 with no opponent:
```python
>>> import rlgym
>>> env = rlgym.make("duel", spawn_opponents=False, reward_fn=SpeedReward())
```
Now we'll take one random action and see what our reward looks like:
```python
>>> env.reset()
>>> obs, reward, done, _ = env.step(env.action_space.sample())
>>> 'Rewarding player ID 0'
>>> print(reward)
>>> 0
```
Alright, now let's look at what happens to our reward when we add an extra player to the environment:
```python
>>> env = rlgym.make("duel", self_play=True, reward_fn=SpeedReward())
>>> env.reset()
>>> action1 = env.action_space.sample()
>>> action2 = env.action_space.sample()
>>> actions = [action1, action2]
>>> obs, reward, done, _ = env.step(actions)
>>> 'Rewarding player ID 0'
>>> 'Rewarding player ID 5'
>>> print(reward)
>>> [0, 0]
```
We can see our reward function gets called twice (and that we had to provide two actions)! Furthermore, the reward that was returned by `env.step(actions)` is no longer a single number. Instead, it is an array of rewards which is organized in the same order as the actions that were given for that step (i.e. reward[0] -> actions[0] & reward[1] -> action[1]).
