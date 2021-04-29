## Observation Builders
An `ObsBuilder` is an object used by RLGym to transform the game state into an input for the agent at every step. Observation builders are used similarly to [Reward Functions](https://rlgym.github.io/docs-page.html#reward-functions)
by the environment. At each step, the observation builder will be called once per player with the current game state. The output of the observation builder will be returned as the `obs` from `env.step`.

Observation builders need to implement two methods
```python
#Called once per reset.
reset(self, initial_state: GameState)

#Called once per step and reset.
build_obs(self, player: PlayerData, state: GameState, previous_action: np.ndarray) -> Any
```

To implement a custom `ObsBuilder`, just inherit from the parent class and implement the above methods.

As an example, let's build an observation builder that contains the physics state of the ball and every player in the match.
```python
from rlgym.utils.obs_builders import ObsBuilder


class CustomObsBuilder(ObsBuilder):
  def reset(self, initial_state: GameState):
    pass

  def build_obs(self, player: PlayerData, state: GameState, previous_action: np.ndarray) -> Any:
    obs = []
    obs += state.ball.seralize()
    
    for player in state.players:
      obs += player.car_data.serialize()
    
    return np.asarray(obs, dtype=np.float32)
```

Now all we need to do is pass our observation builder to RLGym when making a match like so:
```python
import rlgym


env = rlgym.make("default", obs_builder=CustomObsBuilder())
```
And we're done!

### Understanding Perspective
The observation builder we wrote above will work for many purposes, but for training a game playing agent it can be useful to control more than one player with the same agent
(i.e. if we want to use one neural network to control both the orange and blue players in a 1v1). Unfortunately, the observation builder above will return the physics state of every object from the perspective of the game world, so if our agent has learned to play on the blue team it will get confused when we ask it to play on the orange team.

To alleviate this, we can simply transform all the physics data in every object to share the same perspective. While this would be expensive to do in Python, RLGym computes these transformations in C++ when constructing the gamestate in the Bakkesmod plugin. You can access them directly as the "inverted" physics data for each player and the ball.

Let's take a look at an example of building an observation builder that will always return an observation that looks as though it came from a player on the blue team, even if that player is on the orange team.

```python
from rlgym.utils.obs_builders import ObsBuilder
from rlgym.utils import common_values


class CustomObsBuilderBluePerspective(ObsBuilder):
  def reset(self, initial_state: GameState):
    pass

  def build_obs(self, player: PlayerData, state: GameState, previous_action: np.ndarray) -> Any:
    obs = []
    
    #If this observation is being built for a player on the orange team, we need to invert all the physics data we use.
    inverted = player.team_num == common_values.ORANGE_TEAM
    
    if inverted:
      obs += state.inverted_ball.seralize()
    else:
      obs += state.ball.seralize()
      
    for player in state.players:
      if inverted:
        obs += player.inverted_car_data.serialize()
      else:
        obs += player.car_data.serialize()
    
    return np.asarray(obs, dtype=np.float32)
```

Now we can use the same agent to control both teams without having to modify our observation builder!

While these `ObsBuilder` examples show how a user can build an observation containing all the necessary physics information about the game, users might want to build observations containing more or less data. To look at what data is available, please refer to our [Game State Documentation]().
