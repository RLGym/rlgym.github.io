---
title: Creating an Environment
sidebar_position: 2
---

# Creating an Environment

This tutorial demonstrates how to implement a grid world environment using the RLGym API. Each RLGym environment requires implementing the configuration objects described in the [RLGym overview](/Getting%20Started/overview). The following example illustrates an implementation of each required component.

## Grid World Example

We begin by defining the state of our environment, and a transition engine that handles the environment dynamics.

```python
from typing import Dict, List, Tuple, Optional
import numpy as np
from dataclasses import dataclass
from rlgym.api import TransitionEngine, StateMutator, ObsBuilder, ActionParser, RewardFunction, DoneCondition

# First, define our state type
@dataclass
class GridWorldState:
    agent_pos: np.ndarray  # [x, y]
    target_pos: np.ndarray  # [x, y]
    obstacles: List[np.ndarray]  # List of [x, y] positions
    grid_size: int
    steps: int = 0

# Now we implement our Transition Engine, which is the core of the environment.
class GridWorldEngine(TransitionEngine[int, GridWorldState, int]):
    """Handles the core game logic"""
    def __init__(self, grid_size: int):
        self.grid_size = grid_size
        self._state = None
        self._config = {}
        
    @property
    def agents(self) -> List[int]:
        return [0]  # Single agent environment
        
    @property
    def max_num_agents(self) -> int:
        return 1  # This environment only supports one agent
        
    @property
    def state(self) -> GridWorldState:
        return self._state
        
    @property
    def config(self) -> Dict[str, Any]:
        return self._config
        
    @config.setter
    def config(self, value: Dict[str, Any]):
        self._config = value
        
    def step(self, actions: Dict[int, int], shared_info: Dict[str, Any]) -> GridWorldState:
        action = actions[0]  # Get action for our single agent
        current_pos = self._state.agent_pos.copy()
        
        # Apply movement: 0=up, 1=right, 2=down, 3=left
        if action == 0:   current_pos[1] += 1
        elif action == 1: current_pos[0] += 1
        elif action == 2: current_pos[1] -= 1
        elif action == 3: current_pos[0] -= 1
        
        # Ensure we stay in bounds
        current_pos = np.clip(current_pos, 0, self.grid_size - 1)
        
        # Check if move is valid (not into obstacle)
        if not any(np.array_equal(current_pos, obs) for obs in self._state.obstacles):
            self._state.agent_pos = current_pos
            
        self._state.steps += 1
        return self._state
        
    def create_base_state(self) -> GridWorldState:
        # Create a minimal state for the mutator to modify
        return GridWorldState(
            agent_pos=np.zeros(2),  # Will be set by mutator
            target_pos=np.zeros(2),  # Will be set by mutator
            obstacles=[],  # Will be set by mutator
            grid_size=self.grid_size,
            steps=0
        )
        
    def reset(self, initial_state: Optional[GridWorldState] = None) -> None:
        """Reset the engine with an optional initial state"""
        self._state = initial_state if initial_state is not None else self.create_base_state()
```

Now we implement the remaining configuration objects for our environment.

```python
# We need to define a state mutator, which is responsible for modifying the environment state.
class GridWorldMutator(StateMutator[GridWorldState]):
    """Controls environment reset and state modifications"""
    def __init__(self, grid_size: int, num_obstacles: int = 3):
        self.grid_size = grid_size
        self.num_obstacles = num_obstacles
        
    def apply(self, state: GridWorldState, shared_info: Dict[str, Any]) -> None:
        # Random agent and target positions
        state.agent_pos = np.random.randint(0, self.grid_size, size=2)
        state.target_pos = np.random.randint(0, self.grid_size, size=2)
        
        # Random obstacle positions (ensuring they don't overlap)
        state.obstacles = []
        while len(state.obstacles) < self.num_obstacles:
            obs = np.random.randint(0, self.grid_size, size=2)
            if not (np.array_equal(obs, state.agent_pos) or 
                   np.array_equal(obs, state.target_pos) or 
                   any(np.array_equal(obs, o) for o in state.obstacles)):
                state.obstacles.append(obs)

# Here is the Observation Builder, which will convert the environment state into agent observations.
class GridWorldObs(ObsBuilder[int, np.ndarray, GridWorldState, np.ndarray]):
    """Converts state into agent observations"""
        
    def get_obs_space(self, agent: int) -> np.ndarray:
        # [agent_x, agent_y, target_x, target_y, obstacles]
        return np.zeros(4 + 2*3, dtype=np.float32)  # Assuming max 3 obstacles
        
    def reset(self, agents: List[int], initial_state: GridWorldState, shared_info: Dict[str, Any]) -> None:
        pass
        
    def build_obs(self, agents: List[int], state: GridWorldState, shared_info: Dict[str, Any]) -> Dict[int, np.ndarray]:
        # Build observation for each agent
        observations = {}
        for agent in agents:
            # [agent_x, agent_y, target_x, target_y, obstacle positions]
            obs = np.concatenate([
                state.agent_pos,
                state.target_pos,
                np.concatenate(state.obstacles)
            ])
            observations[agent] = obs
        return observations

# Next we need an Action Parser, which will define what actions agents can take. 
# Because we are using a simple discrete action space, we don't need to do anything special here, 
# so we'll just pass the actions from the agent straight through to the transition engine.
class GridWorldActions(ActionParser[int, int, int, GridWorldState, int]):
    """Defines the action space and parsing"""
    def get_action_space(self, agent: int) -> int:
        return 4  # Up, Right, Down, Left
        
    def reset(self, agents: List[int], initial_state: GridWorldState, shared_info: Dict[str, Any]) -> None:
        pass  # No state to reset
        
    def parse_actions(self, actions: Dict[int, int], state: GridWorldState, shared_info: Dict[str, Any]) -> Dict[int, int]:
        # Actions are already in the correct format
        return actions

# Now we need a Reward Function, which will calculate rewards for the agents.
class GridWorldReward(RewardFunction[int, GridWorldState, float]):
    """Calculates rewards for actions"""
    def __init__(self, goal_reward: float = 10.0, step_penalty: float = -0.1):
        self.goal_reward = goal_reward
        self.step_penalty = step_penalty
        
    def reset(self, agents: List[int], initial_state: GridWorldState, shared_info: Dict[str, Any]) -> None:
        pass  # No state to reset
        
    def get_rewards(self, agents: List[int], state: GridWorldState, 
                   is_terminated: Dict[int, bool], is_truncated: Dict[int, bool],
                   shared_info: Dict[str, Any]) -> Dict[int, float]:
        rewards = {}
        for agent in agents:
            if np.array_equal(state.agent_pos, state.target_pos):
                # If we reached the target, provide the goal reward.
                rewards[agent] = self.goal_reward
            else:
                # If we haven't reached the target, apply a step penalty.
                rewards[agent] = self.step_penalty
        return rewards

# Finally we'll create Terminal and Truncated conditions, which will determine when episodes end naturally.
class GridWorldTerminalCondition(DoneCondition[int, GridWorldState]):
    """Determines when episodes naturally end (reaching the goal)"""
    def reset(self, agents: List[int], initial_state: GridWorldState, shared_info: Dict[str, Any]) -> None:
        pass
        
    def is_done(self, agent: int, state: GridWorldState) -> bool:
        # Episode ends naturally when we reach the target
        return np.array_equal(state.agent_pos, state.target_pos)

class GridWorldTruncatedCondition(DoneCondition[int, GridWorldState]):
    """Determines when episodes are cut short (timeout)"""
    def __init__(self, max_steps: int = 100):
        self.max_steps = max_steps
        
    def reset(self, agents: List[int], initial_state: GridWorldState, shared_info: Dict[str, Any]) -> None:
        pass
        
    def is_done(self, agent: int, state: GridWorldState) -> bool:
        # Episode is truncated if we exceed max steps
        return state.steps >= self.max_steps

```
With all configuration objects implemented, we can construct the environment by passing an instance of each object to the RLGym constructor.

```python
# Build the environment
env = RLGym(
        state_mutator=GridWorldMutator(grid_size),
        obs_builder=GridWorldObs(),
        action_parser=GridWorldActions(),
        reward_fn=GridWorldReward(),
        transition_engine=GridWorldEngine(grid_size),
        termination_cond=GridWorldTerminalCondition(),
        truncation_cond=GridWorldTruncatedCondition(),
    )

# Interact with our gridworld like any other RLGym environment.
obs = env.reset()
ep_rew = 0

for _ in range(1000):
    action = {0: env.action_space.sample()}  # Random action
    obs, reward, done, truncated, info = env.step(action)
    ep_rew += reward[0] # Reward for agent 0
    
    if done or truncated:
        obs = env.reset()
        print(f"Episode reward: {ep_rew}")
        ep_rew = 0
```
The environment is now ready for integration with a learning algorithm to train a grid world agent.
