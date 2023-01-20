## Observation Builders
An `ObsBuilder` is an object used by RLGym to transform the game state into an input for the agent at every step. Observation builders are used similarly to [Reward Functions](https://rlgym.github.io/docs-page.html#reward-functions)
by the environment. At each step, the observation builder will be called once for every player in the current game state.

Observation builders need to implement two methods.
```python
#Called once per reset.
reset(self, initial_state: GameState)

#Called once per step and reset.
build_obs(self, player: PlayerData, state: GameState, previous_action: np.ndarray) -> Any
```

Implementing a custom `ObsBuilder` is just as easy as implementing a custom `RewardFunction`. All we have to do is inherit from the parent class and implement the above methods.

As an example, let's write an observation builder that contains the physics state of the ball and every player in the match.
```python
from rlgym.utils.obs_builders import ObsBuilder
from rlgym.utils.gamestates import PlayerData, GameState
import numpy as np

class CustomObsBuilder(ObsBuilder):
  def reset(self, initial_state: GameState):
    pass

  def build_obs(self, player: PlayerData, state: GameState, previous_action: np.ndarray) -> Any:
    obs = []
    obs += state.ball.serialize()
    
    for player in state.players:
      obs += player.car_data.serialize()
    
    return np.asarray(obs, dtype=np.float32)
```

Now all we need to do is pass our observation builder to RLGym when making a match.
```python
import rlgym


env = rlgym.make(obs_builder=CustomObsBuilder())
#Training loop goes here
```
And we're done!

### Understanding Perspective
The observation builder we wrote above will work for many purposes, but when training a game-playing agent it can be useful to represent the game world from a common perspective so the agent can play on both the orange and blue teams without unnecessary learning time. Unfortunately, the observation builder we just wrote will return the physics state of every object from the perspective of the game world, so if our agent has learned to play on the blue team it may get confused if we ask it to play on the orange team.

To alleviate this, we can simply transform all the physics data in every game object to share a common perspective. While this would be expensive to do in Python, RLGym computes these transformations in C++ when constructing the gamestate in the Bakkesmod plugin. You can access them directly as the "inverted" physics data for each player and the ball.

Let's take a look at an example of implementing an observation builder that will always return an observation that looks as though it came from a player on the blue team, even if that player is on the orange team.

```python
from rlgym.utils.obs_builders import ObsBuilder
from rlgym.utils import common_values
from rlgym.utils.gamestates import PlayerData, GameState
import numpy as np


class CustomObsBuilderBluePerspective(ObsBuilder):
  def reset(self, initial_state: GameState):
    pass

  def build_obs(self, player: PlayerData, state: GameState, previous_action: np.ndarray) -> Any:
    obs = []
    
    #If this observation is being built for a player on the orange team, we need to invert all the physics data we use.
    inverted = player.team_num == common_values.ORANGE_TEAM
    
    if inverted:
      obs += state.inverted_ball.serialize()
    else:
      obs += state.ball.serialize()
      
    for player in state.players:
      if inverted:
        obs += player.inverted_car_data.serialize()
      else:
        obs += player.car_data.serialize()
    
    return np.asarray(obs, dtype=np.float32)
```

Now we can use the same agent to control both teams without having to modify our observation builder!

While these `ObsBuilder` examples show how a user can build an observation containing all the necessary physics information about the game, users might want to build observations containing different data. To look at what data is available, please refer to our [Game State Documentation](/).
