## Action Parsers

RLGym expects an array of 8 actions per agent on the pitch. Each action corresponds to one control input:

* throttle
* steer
* yaw 
* pitch
* roll
* jump
* boost 
* handbrake
        
The first five values are expected to be in the range [-1, 1], while the last three values should be either 0 or 1.
To allow a variety of action inputs while still adhering to requirements of RLGym, we use an `ActionParser`.

An `ActionParser` has two methods 

```python
# Called during the initialization of the environment
def get_action_space(self) -> gym.spaces.Space:

# Called every step, turning the given actions into the 8 RLGym expects
def parse_actions(self, actions: Any, state: GameState) -> np.ndarray:
```


To create a custom action parser, inherit from `ActionParser` abstract class and implement the two above methods. Here's
an already built action parser that turns a set of continuous actions into discrete actions for faster learning.
```python
import numpy as np
import gym.spaces
from rlgym.utils.gamestates import GameState
from rlgym.utils.action_parsers import ActionParser


class DiscreteAction(ActionParser):
    """
    Simple discrete action space. All the analog actions have 3 bins by default: -1, 0 and 1.
    """

    def __init__(self, n_bins=3):
        super().__init__()
        assert n_bins % 2 == 1, "n_bins must be an odd number"
        self._n_bins = n_bins

    def get_action_space(self) -> gym.spaces.Space:
        return gym.spaces.MultiDiscrete([self._n_bins] * 5 + [2] * 3)

    def parse_actions(self, actions: np.ndarray, state: GameState) -> np.ndarray:
        actions = actions.reshape((-1, 8))

        # map all ternary actions from {0, 1, 2} to {-1, 0, 1}.
        actions[..., :5] = actions[..., :5] / (self._n_bins // 2) - 1

        return actions
```

Now we can simply pass an instance of our concrete `ActionParser` to RLGym when we make an environment.
```python
import rlgym


env = rlgym.make(action_parser=DiscreteAction())
#Training loop goes here
```

Be aware that whatever you are using to generate actions must be compatible with your chosen action parser accepts. A 
parser that assumes it will only be given 5 actions will probably throw an error if given 6. The usual assumption is for `n*8` 
actions to be given to a parser, where `n` is the number of agents. Check the specifics of your desired parser for details.
