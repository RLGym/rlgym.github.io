---
title: Using stable-baselines3
---

## Single Game Instance

Unfortunately, SB3 does not natively support the concept of self-play.
However, `rlgym-tools` provides a wrapper to get around this by treating each agent in a single match as though it were its own environment within SB3.
With this, we can train more than one copy of our agent in one instance of the game through self-play.
Let's see how we can set up an RLGym environment, wrap it in the `SB3SingleInstanceEnv`, and use the SB3 implementation of PPO to train it with self-play for 1,000,000 timesteps.

```python
# import the gym and stable baselines 3 libraries
import rlgym
from stable_baselines3.ppo import PPO
from rlgym_tools.sb3_utils import SB3SingleInstanceEnv

# setup the RLGym environment
gym_env = rlgym.make(use_injector=True, self_play=True)

# wrap the RLGym environment with the single instance wrapper
env = SB3SingleInstanceEnv(gym_env)

# create a PPO instance and start learning
learner = PPO(policy="MlpPolicy", env=env, verbose=1)
learner.learn(1_000_000)
```

## Multiple Game Instances

Most consumer hardware is capable of running more than just one instance of Rocket League at a time. 
We would like to take advantage of that when training an agent for complex tasks like playing the game effectively.
Fortunately, SB3 supports multi-processing natively, so we can use the `rlgym-tools` multi-instance wrapper to launch as many parallel game instances as we like.

Using this wrapper requires us to make a special function that will construct a `rlgym.envs.Match` object with all the necessary settings and objects.
This is because RLGym needs each instance of the environment to exist in an independent process, so our wrapper will use this function to create each environment after its process has been spawned.
Let's look at an example for how to use the `SB3MultipleInstanceEnv` with the SB3 implementation of  PPO to train an agent for 1,000,000 timesteps with 2 instances of the game open.

```python
# Here we import the Match object and our multi-instance wrapper
from rlgym.envs import Match
from rlgym_tools.sb3_utils import SB3MultipleInstanceEnv

# Since we can't use the normal rlgym.make() function.
# We need to import all the default configuration objects to give to our Match.
from rlgym.utils.reward_functions import DefaultReward
from rlgym.utils.obs_builders import DefaultObs
from rlgym.utils.state_setters import DefaultState
from rlgym.utils.terminal_conditions.common_conditions import TimeoutCondition

# Finally, we import the SB3 implementation of PPO.
from stable_baselines3.ppo import PPO

"""
    This is the function we need to provide to our SB3MultipleInstanceEnv to construct a match.
    Note that this function MUST return a Match object.
"""
def get_match():
    """
        Here we configure our Match.
        If you want to use custom configuration objects.
        Make sure to replace the default arguments here with instances of the objects you want.
    """
    return Match(
        reward_function=DefaultReward(),
        terminal_conditions=[TimeoutCondition(225)],
        obs_builder=DefaultObs(),
        state_setter=DefaultState(),
        
        self_play=True,
    )
    

#If we want to spawn new processes, we have to make sure our program starts in a proper Python entry point.
if __name__ == "__main__":
    """
        Now all we have to do is make an instance of the SB3MultipleInstanceEnv and pass it our get_match function.
        The number of instances we'd like to open, and how long it should wait between instances.
        This wait_time argument is important because if multiple Rocket League clients are opened in quick succession.
        They will cause each other to crash.
        The exact reason this happens is unknown to us,
        but the easiest solution is to delay for some period of time between launching clients.
        The amount of required delay will depend on your hardware.
        So make sure to change this number if your Rocket League clients are crashing before they fully launch.
    """
    env = SB3MultipleInstanceEnv(match_func_or_matches=get_match, num_instances=2, wait_time=20)
    learner = PPO(policy="MlpPolicy", env=env, verbose=1)
    learner.learn(1_000_000)
```
