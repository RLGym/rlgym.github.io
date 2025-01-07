---
title: Reward Functions
---

# Reward Functions

A `RewardFunction` is an object used by an RLGym environment to compute the rewards for each agent every step.

All reward functions must implement the following methods:

```python
# Called every time `TransitionEngine.create_base_state()` is called.
def reset(self, agents: List[AgentID], initial_state: StateType, shared_info: Dict[str, Any]) -> None:

# Called every time `TransitionEngine.step()` is called.
def get_rewards(self, agents: List[AgentID], state: StateType, is_terminated: Dict[AgentID, bool], 
               is_truncated: Dict[AgentID, bool], shared_info: Dict[str, Any]) -> Dict[AgentID, RewardType]:
```

## Example
Here's a simple reward function that encourages agents to drive faster - the faster they go, the more reward they get:

```python
from typing import List, Dict, Any, Union, Tuple

from rlgym.api import RewardFunction, AgentID
from rlgym.rocket_league.api import GameState
import numpy as np


class SpeedReward(RewardFunction):
  def reset(self, agents: List[AgentID], initial_state: GameState, shared_info: Dict[str, Any]) -> None:
      pass
  
  def get_rewards(self, agents: List[AgentID], state: GameState, is_terminated: Dict[AgentID, bool],
                  is_truncated: Dict[AgentID, bool], shared_info: Dict[str, Any]) -> Dict[AgentID, float]:
      
    rewards = {}
    for agent in agents:
        car = state.cars[agent]
        linear_velocity = car.physics.linear_velocity
        reward = np.linalg.norm(linear_velocity)  # Reward is the car's speed
        rewards[agent] = reward
        
    return rewards
```

That's it! Just pass this reward function to your environment and watch your agents learn to zoom around the field.
