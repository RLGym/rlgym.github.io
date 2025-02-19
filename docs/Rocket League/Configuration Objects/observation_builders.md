---
title: Observation Builders
---

# Observation Builders

An `ObsBuilder` is an object used by RLGym to transform a `GameState` from the transition engine into inputs for each 
agent at every step. An observation builder is expected to build one observation per agent in the environment.

To make your own observation builder, you'll need three methods:

```python
# This tells your learning algorithm what kind of observations to expect
def get_obs_space(self, agent: AgentID) -> ObsSpaceType:
    
# Called every time `TransitionEngine.create_base_state()` is called.
def reset(self, agents: List[AgentID], initial_state: StateType, shared_info: Dict[str, Any]) -> None:

# Called every time `TransitionEngine.step()` or `TransitionEngine.create_base_state()` is called.
def build_obs(self, agents: List[AgentID], state: StateType, shared_info: Dict[str, Any]) -> Dict[AgentID, ObsType]:
```

## Example

Let's create a simple observation builder that lets each agent see its own physics state (position, velocity, etc.) and the ball's physics state. Here's how we do it:

```python
from rlgym.api import ObsBuilder, AgentID
from rlgym.rocket_league.api import Car, GameState
from typing import List, Dict, Any, Tuple
import numpy as np


class CustomObsBuilder(ObsBuilder):
    def get_obs_space(self, agent: AgentID) -> Tuple[str, int]:
        # Each observation will have 24 numbers (physics data for car and ball)
        return 'real', 24
    
    def reset(self, agents: List[AgentID], initial_state: GameState, shared_info: Dict[str, Any]) -> None:
        pass

    def build_obs(self, agents: List[AgentID], state: GameState, shared_info: Dict[str, Any]) -> Dict[AgentID, np.ndarray]:
        obs = {}
        
        # Build an observation for each agent
        for agent in agents:
            obs[agent] = self._build_obs(agent, state, shared_info)
        
        return obs
    
    def _build_obs(self, agent: AgentID, state: GameState, shared_info: Dict[str, Any]) -> np.ndarray:
        # Here we build an observation for a single agent.
        agent_physics_state = state.cars[agent].physics
        ball = state.ball
        
        agent_obs = [
            # Ball physics data.
            ball.position,
            ball.linear_velocity,
            ball.angular_velocity,
            
            # Agent physics data. Forward and up vectors are used because they fully specify the orientation of the car.
            agent_physics_state.position,
            agent_physics_state.forward,
            agent_physics_state.up,
            agent_physics_state.linear_velocity,
            agent_physics_state.angular_velocity
        ]
        
        return np.concatenate(agent_obs)
```

Now we can provide an instance of our `CustomObsBuilder` to an RLGym environment whenever we make one!

## Understanding Perspective
If we tried to train an agent to play the game using the observation builder in the above example won't get us very far
for a number of reasons. One of those is that our agents don't know what team they're on! To avoid re-learning the same
strategy on both sides of the pitch, it's often useful to transform the physics information for the agents and ball such
that agents always view the pitch from the perspective of a player on the blue team.

To do this, we'll check which team the agent is on before building an observation for it and when we find an agent on the
orange team we will use the `inverted_physics` property available in the `Car` object. This will compute the inverted physics
data for that car if it has not yet been computed and return it to us.

Let's modify our above example to include the `inverted_physics` object when appropriate.
```python
from rlgym.api import ObsBuilder, AgentID
from rlgym.rocket_league.api import Car, GameState
from rlgym.rocket_league.common_values import BLUE_TEAM
from typing import List, Dict, Any, Tuple
import numpy as np


class CustomObsBuilder(ObsBuilder):
    def get_obs_space(self, agent: AgentID) -> Tuple[str, int]:
        # Each observation will have 24 numbers (physics data for car and ball)
        return 'real', 24
    
    def reset(self, agents: List[AgentID], initial_state: GameState, shared_info: Dict[str, Any]) -> None:
        pass

    def build_obs(self, agents: List[AgentID], state: GameState, shared_info: Dict[str, Any]) -> Dict[AgentID, np.ndarray]:
        obs = {}
        
        # Build an observation for each agent
        for agent in agents:
            obs[agent] = self._build_obs(agent, state, shared_info)
        
        return obs
    
    def _build_obs(self, agent: AgentID, state: GameState, shared_info: Dict[str, Any]) -> np.ndarray:
        # We will first grab the car that is being controlled by this agent.
        car = state.cars[agent]
        
        # Then we'll check if this agent is on the blue team already.
        if car.team_num == BLUE_TEAM:
            agent_physics_state = state.cars[agent].physics
            ball = state.ball
        else:
            # If this agent isn't on the blue team we'll use the inverted physics information for both the car and the ball.
            agent_physics_state = state.cars[agent].inverted_physics
            ball = state.inverted_ball
        
        # The rest of the code can remain unchanged!
        agent_obs = [
            # Ball physics data.
            ball.position,
            ball.linear_velocity,
            ball.angular_velocity,
            
            # Agent physics data. Forward and up vectors are used because they fully specify the orientation of the car.
            agent_physics_state.position,
            agent_physics_state.forward,
            agent_physics_state.up,
            agent_physics_state.linear_velocity,
            agent_physics_state.angular_velocity
        ]
        
        return np.concatenate(agent_obs)
```

Now our agents will always think they're playing on the blue side of the pitch!

While these `ObsBuilder` examples won't crash if provided to an RLGym environment, they lack a lot of information that
an effective game-playing agent would need to know about. If you're looking for a more complete example, check out the [default observation builder](https://github.com/lucas-emery/rocket-league-gym/blob/main/rlgym/rocket_league/obs_builders/default_obs.py) provided by RLGym!
