---
title: State Mutators
---

# State Mutators

Before anything happens in the environment, there must be an initial state. RLGym v2 provides a way for users to construct and modify this state via `StateMutator` objects. Multiple `StateMutator` objects can be combined using `MutatorSequence`, which applies them sequentially to modify the current state.

The sequence of `StateMutator` objects is invoked each time `TransitionEngine.create_base_state()` is called. The state returned by the final `StateMutator` in the sequence becomes the current state of the `TransitionEngine`.

## Creating a Custom State Mutator

To implement a custom state mutator, inherit from the `StateMutator` class and implement its `apply` method. The following example demonstrates a mutator that sets specific positions for cars and the ball:

```python
from typing import Dict, Any
import numpy as np
from rlgym.api import StateMutator
from rlgym.rocket_league.api import GameState
from rlgym.rocket_league import common_values

class CustomStateMutator(StateMutator[GameState]):
    """A StateMutator that sets custom positions for cars and the ball."""
    
    def apply(self, state: GameState, shared_info: Dict[str, Any]) -> None:
        # Define spawn location and orientation
        desired_car_pos = np.array([100, 100, 17], dtype=np.float32)  # x, y, z
        desired_yaw = np.pi/2

        # Iterate over all cars in the game
        for car in state.cars.values():
            if car.is_orange:
                # Orange team positions
                pos = desired_car_pos
                yaw = desired_yaw
            else:
                # Blue team positions (inverted)
                pos = -desired_car_pos
                yaw = -desired_yaw

            # Set car physics state
            car.physics.position = pos
            car.physics.euler_angles = np.array([0, 0, yaw], dtype=np.float32)
            car.boost = 33

        # Set ball physics state
        state.ball.position = np.array([0, 0, common_values.CEILING_Z/2], dtype=np.float32)
        state.ball.linear_velocity = np.zeros(3, dtype=np.float32)
        state.ball.angular_velocity = np.zeros(3, dtype=np.float32)
```

## Using State Mutators

To use state mutators in your environment, you can pass them directly to the `RLGym` constructor. You can also combine multiple mutators using `MutatorSequence`. Here's an example:

```python
from rlgym.api import RLGym
from rlgym.rocket_league.state_mutators import MutatorSequence, FixedTeamSizeMutator, KickoffMutator

# Create environment with a sequence of mutators
env = RLGym(
    state_mutator=MutatorSequence(
        FixedTeamSizeMutator(blue_size=2, orange_size=2),  # Set up 2v2 game
        KickoffMutator(),  # Set up kickoff positions
        CustomStateMutator()  # Apply our custom state changes
    ),
    # ... other configuration objects ...
)
```