---
title: Done Conditions
sidebar_position: 5
---

# Done Conditions

A `DoneCondition` determines when an episode should end. In RLGym v2, a done condition can signal either a terminal state (natural episode end) or a truncated state (early termination). The RocketSim transition engine handles checking these conditions and setting the appropriate flags in the environment step.

## Implementation

To implement a done condition, a user must define two methods: `reset` and `is_done`. The `reset` method is called when the environment is reset, and the `is_done` method determines if the current state should end the episode.

```python
# Called once when the environment is reset.
def reset(self, agents: List[AgentID], initial_state: GameState, shared_info: Dict[str, Any]) -> None:

# Called once per step, returns a dictionary indicating if each agent's episode should end.
def is_done(self, agents: List[AgentID], state: GameState, shared_info: Dict[str, Any]) -> Dict[AgentID, bool]:
```

## Examples

Here's a done condition that ends the episode when a goal is scored. We would use this as a terminal condition:

```python
from typing import List, Dict, Any
from rlgym.api import DoneCondition, AgentID
from rlgym.rocket_league.api import GameState

class GoalCondition(DoneCondition[AgentID, GameState]):
    """
    A DoneCondition that is satisfied when a goal is scored.
    """
    def reset(self, agents: List[AgentID], initial_state: GameState, shared_info: Dict[str, Any]) -> None:
        pass

    def is_done(self, agents: List[AgentID], state: GameState, shared_info: Dict[str, Any]) -> Dict[AgentID, bool]:
        return {agent: state.goal_scored for agent in agents}
```

Sometimes we would rather cut an episode early. For example, if we want to prevent the episode from going on for too long while nothing is happening, we could use a done condition that checks if the ball hasn't been touched for a certain amount of time. We would use this as a truncation condition:

```python
from typing import List, Dict, Any
from rlgym.api import DoneCondition, AgentID
from rlgym.rocket_league.api import GameState
from rlgym.rocket_league.common_values import TICKS_PER_SECOND

class NoTouchTimeoutCondition(DoneCondition[AgentID, GameState]):
    """
    A DoneCondition that is satisfied when no car has touched the ball for a specified amount of time.
    """
    def __init__(self, timeout_seconds: float):
        """
        Args:
            timeout_seconds: Timeout in seconds
        """
        self.timeout_seconds = timeout_seconds
        self.last_touch_tick = None

    def reset(self, agents: List[AgentID], initial_state: GameState, shared_info: Dict[str, Any]) -> None:
        self.last_touch_tick = initial_state.tick_count

    def is_done(self, agents: List[AgentID], state: GameState, shared_info: Dict[str, Any]) -> Dict[AgentID, bool]:
        if any(car.ball_touches > 0 for car in state.cars.values()):
            self.last_touch_tick = state.tick_count
            done = False
        else:
            time_elapsed = (state.tick_count - self.last_touch_tick) / TICKS_PER_SECOND
            done = time_elapsed >= self.timeout_seconds

        return {agent: done for agent in agents}
```

## Combining Conditions

If you want to combine more than one done condition, into a single object, you can use the `AnyCondition` or `AllCondition` classes. As their names imply, they will return `True` if any or all of the provided conditions are satisfied, respectively. While in practice we wouldn't want to combine our example conditions into one, this code snippet shows how to do it:

```python
from rlgym.rocket_league.done_conditions import AnyCondition, AllCondition, GoalCondition, NoTouchTimeoutCondition

# This will end the episode as soon as a goal is scored OR the ball hasn't been touched for 30 seconds.
any_condition = AnyCondition([
    GoalCondition(),
    NoTouchTimeoutCondition(timeout_seconds=30)
])

# This will end the episode when a goal is scored AND the ball hasn't been touched for 30 seconds.
all_condition = AllCondition([
    GoalCondition(),
    NoTouchTimeoutCondition(timeout_seconds=30)
])
```