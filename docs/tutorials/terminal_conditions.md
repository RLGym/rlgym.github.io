---
title: Terminal Conditions
---

## Terminal Conditions
A `TerminalCondition` is a simple object that examines the current game state and returns `True` if that state should be the final state in an episode, and `False` otherwise.
Terminal conditions can be paired together in a list, in which case an episode will be terminated if any of the provided terminal conditions are evaluated to `True`.

A terminal condition must implement two methods:
```python
#Called once per reset.
reset(self, initial_state: GameState)

#Called once per step.
is_terminal(self, current_state: GameState) -> bool
```
To write a custom terminal condition, inherit from the parent class and implement the above methods.

As an example, let's implement a custom terminal condition that will end an episode as soon as any player touches the ball.
```python
from rlgym.utils.terminal_conditions import TerminalCondition
from rlgym.utils.gamestates import GameState


class CustomTerminalCondition(TerminalCondition):
  def reset(self, initial_state: GameState):
    pass

  def is_terminal(self, current_state: GameState) -> bool:
    return current_state.last_touch != -1
```
And just like that, we're done!

Now all we have to do is pass our terminal condition into RLGym in the form of a `list`, like so:
```python
import rlgym


env = rlgym.make(terminal_conditions=[CustomTerminalCondition()])
#Training loop goes here
```
RLGym will now terminate an episode only when the ball has been touched by any player in the match. However, if we're training an agent with random initial parameters, it may
take quite some time in the early stages of training for any player to accidentally touch the ball. Because of this, it might be useful for us to terminate an episode if a 
player has touched the ball or if some number of seconds have passed in the game.

To do this, we can leverage the existing `TimeoutCondition` that comes with RLGym natively in combination with our custom terminal condition. Let's say we want an episode to end
after 20 seconds of in-game time or if a player has touched the ball. All we need to do is compute how many `env.step()` calls it will take for 20 seconds to pass in the game, 
and pass that in to the constructor of `TimeoutCondition`. Then we can simply add the timeout condition to our list of terminal conditions when we ask RLGym to make an 
environment, and we're done!

```python
import rlgym
from rlgym.utils.terminal_conditions.common_conditions import TimeoutCondition

default_tick_skip = 8
physics_ticks_per_second = 120
ep_len_seconds = 20

max_steps = int(round(ep_len_seconds * physics_ticks_per_second / default_tick_skip))

condition1 = TimeoutCondition(max_steps)
condition2 = CustomTerminalCondition()

env = rlgym.make(terminal_conditions=[condition1, condition2])
#Training loop goes here
```
Now we've successfully configured multiple terminal conditions for our environment!
