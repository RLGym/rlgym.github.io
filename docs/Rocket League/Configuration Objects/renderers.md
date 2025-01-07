---
title: Renderers
---

# Renderers

RLGym v2 provides a way to visualize the game state during training or evaluation through the `Renderer` interface. The renderer is responsible for displaying the current state of the game, including car positions, ball position, boost pads, and other game elements.

## Creating a Custom Renderer

`Renderers` have two methods:
```python
# Must be manually called by the user via RLGym.render(). Arguments are provided automatically by the RLGym environment.
def render(self, state: StateType, shared_info: Dict[str, Any]) -> Any:

# Called once when the environment is closed.
def close(self) -> None:
```

Here's an example of a simple renderer that prints the ball's position:

```python
from typing import Dict, Any
import numpy as np
from rlgym.api import Renderer
from rlgym.rocket_league.api import GameState

class BallPositionRenderer(Renderer[GameState]):
    """A simple renderer that prints the ball's position."""
    
    def render(self, state: GameState, shared_info: Dict[str, Any]) -> Any:
        print(f"Ball position: {state.ball.position}")
    
    def close(self):
        """Called when the environment is closed."""
        pass
```


## Using Renderers

To use a renderer with your environment, just pass an instance of your renderer to the `RLGym` constructor:
```python
env = RLGym(
    # ... other configuration objects ...
    renderer=BallPositionRenderer()
)
```
then call `env.render()` when you want to visualize the current state:
```python
obs = env.reset()
while True:
    actions = {agent_id: env.action_space.sample() for agent_id in env.agents}
    obs, reward, terminated, truncated, info = env.step(actions)
    env.render()  # This will call your renderer's `render` method
    
    if terminated or truncated:
        break
```
and make sure to call `env.close()` when you're done:
```python
env.close()
```