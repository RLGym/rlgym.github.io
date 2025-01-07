---
title: State Mutators
---

# State Mutators

Before anything happens in the environment, there must be an initial state. RLGym v2 provides a way for users to construct and modify this state via `StateMutator` objects. If more than one `StateMutator` is provided, they can be combined using `MutatorSequence`, which will apply them in sequence, each modifying the current contents of the state.

Every time `TransitionEngine.create_base_state()` is called, the list of provided `StateMutator` objects will be called again to construct a new state. The state returned by the final `StateMutator` in the sequence will become the current state of the `TransitionEngine`.

## Creating a Custom State Mutator

To create a custom state mutator, we need to inherit from the `StateMutator` class and implement its `apply` method. Here's an example where we'll create a mutator that spawns cars in specific positions and sets the ball state:

```python
from typing import Dict, Any
import numpy as np
from rlgym.api import StateMutator
from rlgym.rocket_league.api import GameState
from rlgym.rocket_league import common_values

class CustomStateMutator(StateMutator[GameState]):
    """A StateMutator that sets custom positions for cars and the ball."""
    
    def apply(self, state: GameState, shared_info: Dict[str, Any]) -> None:
        # Set up our desired spawn location and orientation
        desired_car_pos = np.array([100, 100, 17], dtype=np.float32)  # x, y, z
        desired_yaw = np.pi/2

        # Loop over every car in the game
        for car in state.cars.values():
            if car.is_orange:
                # Orange team positions
                pos = desired_car_pos
                yaw = desired_yaw
            else:
                # Blue team positions (inverted)
                pos = -desired_car_pos
                yaw = -desired_yaw

            # Set the car's physics state
            car.physics.position = pos
            car.physics.euler_angles = np.array([0, 0, yaw], dtype=np.float32)
            car.boost = 33  # Set boost to 33

        # Set the ball state
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