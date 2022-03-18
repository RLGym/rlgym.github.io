## State Setters

In some cases, we may want to directly manipulate the state of the game to train an agent to perform some task. To facilitate this, RLGym can be configured with a `StateSetter` object that will determine the initial state of the game every time `env.reset()` is called. To make one, all we have to do is override the abstract class and implement its method, just like all the other configuration objects in RLGym.

A `StateSetter` only has a single method:
```python
def reset(self, state_wrapper: StateWrapper):
```
This introduces us to a new type of object with the `StateWrapper`. This object contains a mutable representation of every physics object that RLGym can manipulate. When setting the state of the game, you will directly change the state of the objects contained by the `StateWrapper`. Let's look at an example where we will set the state of every car in the match, and the ball.

```python
from rlgym.utils.state_setters import StateSetter
from rlgym.utils.state_setters import StateWrapper
from rlgym.utils.common_values import BLUE_TEAM, ORANGE_TEAM, CEILING_Z
import numpy as np

class CustomStateSetter(StateSetter):
    def reset(self, state_wrapper: StateWrapper):
    
        # Set up our desired spawn location and orientation. Here, we will only change the yaw, leaving the remaining orientation values unchanged.
        desired_car_pos = [100,100,17] #x, y, z
        desired_yaw = np.pi/2
        
        # Loop over every car in the game.
        for car in state_wrapper.cars:
            if car.team_num == BLUE_TEAM:
                pos = desired_car_pos
                yaw = desired_yaw
                
            elif car.team_num == ORANGE_TEAM:
                # We will invert values for the orange team so our state setter treats both teams in the same way.
                pos = [-1*coord for coord in desired_car_pos]
                yaw = -1*desired_yaw
                
            # Now we just use the provided setters in the CarWrapper we are manipulating to set its state. Note that here we are unpacking the pos array to set the position of 
            # the car. This is merely for convenience, and we will set the x,y,z coordinates directly when we set the state of the ball in a moment.
            car.set_pos(*pos)
            car.set_rot(yaw=yaw)
            car.boost = 0.33
            
        # Now we will spawn the ball in the center of the field, floating in the air.
        state_wrapper.ball.set_pos(x=0, y=0, z=CEILING_Z/2)
```

And just like that we have configured a `StateSetter` that will spawn every car near the center of the field, and cause the ball to spawn in the air at the center of the field. To use this, all we have to do is pass it to RLGym just like we would with any other configuration object.

```python
import rlgym


env = rlgym.make(state_setter=CustomStateSetter())
```

Now we're done! To learn more about values that you might need to know when manipulating the state of the game, check out RLBot's [useful game values](https://github.com/RLBot/RLBot/wiki/Useful-Game-Values) page (note that some of these are already included in `rlgym.utils.common_values`).
