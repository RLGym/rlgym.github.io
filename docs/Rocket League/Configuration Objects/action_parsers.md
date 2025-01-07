---
title: Action Parsers
---

# Action Parsers

Action parsers are how your agent's decisions get turned into actual game inputs. They take whatever your policy outputs and convert it into the 8 controller inputs that RocketSim and Rocket League understand (things like throttle, steering, etc.). Check out our [Game Values](../../Cheatsheets/game_values) cheatsheet to see what these inputs are.

## How They Work

Every `ActionParser` needs three methods:

```python
# Called during the initialization of the environment, this is used to inform the learning algorithm how many outputs
# the policy must provide, and their type.
def get_action_space(self, agent: AgentID) -> SpaceType:

# Called every time `TransitionEngine.create_base_state()` is called.
def reset(self, initial_state: StateType, shared_info: Dict[str, Any]) -> None:
    
# Called every time `TransitionEngine.step()` is called. This function is responsible for translating actions into transition engine inputs for each agent.
def parse_actions(self, actions: Dict[AgentID, ActionType], state: StateType, shared_info: Dict[str, Any]) -> Dict[AgentID, EngineActionType]:
```

## Creating Your Own

To create a custom action parser, inherit from `ActionParser` class and implement those methods. Here's an example that takes 8 continuous values between -1 and 1, and converts the last 3 into binary (0 or 1) inputs to match what the game expects:

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