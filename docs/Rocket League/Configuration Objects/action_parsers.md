---
title: Action Parsers
---

# Action Parsers

Action parsers define an interface that translates outputs from a policy into inputs that will be provided to the
`TransitionEngine` before computing the next game state. RocketSim and Rocket League both 
expect an array of 8 values per agent on the pitch where each element corresponds to one controller input. For a list of valid inputs, refer to the car controls table in our [Game Values](../../Cheatsheets/game_values) cheatsheet.



Every `ActionParser` has three methods:

```python
# Called during the initialization of the environment, this is used to inform the learning algorithm how many outputs
# the policy must provide, and their type.
def get_action_space(self, agent: AgentID) -> SpaceType:

# Called every time `TransitionEngine.create_base_state()` is called.
def reset(self, initial_state: StateType, shared_info: Dict[str, Any]) -> None:
    
# Called every time `TransitionEngine.step()` is called. This function is responsible for translating actions into transition engine inputs for each agent.
def parse_actions(self, actions: Dict[AgentID, ActionType], state: StateType, shared_info: Dict[str, Any]) -> Dict[AgentID, EngineActionType]:
```

To create a custom action parser, inherit from `ActionParser` abstract class and implement the two above methods.
As an example let's look at a pre-built action parser that receives a set of 8 continuous values on the interval `[-1, 1]`
and applies a threshold to the last 3 values such that they will become either `0` or `1` to comply with the valid car 
controls listed in the table above.

```python
from typing import Dict, Any

import numpy as np

from rlgym.api import ActionParser, AgentID
from rlgym.rocket_league.api import GameState

class ContinuousAction(ActionParser[AgentID, np.ndarray, np.ndarray, GameState, int]):
    """
    Simple continuous action space that maps an array of 8 values on the interval [-1, 1] into an array of valid car
    controls.
    """

    def __init__(self):
        super().__init__()
        # Rocket League expects 8 values per controller input.
        self._n_controller_inputs = 8
        
    def get_action_space(self) -> tuple:
        return float(self._n_controller_inputs), 'continuous'

    def reset(self, initial_state: GameState, shared_info: Dict[str, Any]) -> None:
        pass

    def parse_actions(self, actions: Dict[AgentID, np.ndarray], state: GameState, shared_info: Dict[str, Any]) -> Dict[AgentID, np.ndarray]:
        parsed_actions = {}
        
        # Loop over the agent action dictionary
        for agent, action in actions.items():
            # Copy the action into a new array
            car_controls = np.zeros(self._n_controller_inputs)
            car_controls[:] = action[:]
            
            # All the actions from our policy will be on the interval [-1, 1], but the last 3 values in the car controls
            # need to be either 0 or 1. We will shift and round the result such that any value below 0 becomes 0 and
            # any value above 0 becomes 1.
            car_controls[-3:] = np.round((car_controls[-3:] + 1) / 2)
            parsed_actions[agent] = car_controls

        return parsed_actions
```

Now we can pass an instance of our `ContinuousAction` to RLGym whenever we make an environment!