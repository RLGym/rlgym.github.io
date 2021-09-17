## Using SB3 with Multiple Game Instances

Most consumer hardware is capable of running more than just one instance of Rocket League at a time, and we would like to take advantage of that when training an agent for complex tasks like playing the game effectively. Fortunately, SB3 supports with multi-processing
natively, so we can use the `rlgym-tools` multi-instance wrapper to take advantage of that. Using this wrapper requires us to make a special function that, when called, will construct a `rlgym.envs.Match` object with all the necessary settings and objects. This is because
RLGym needs each instance of the environment to exist in an independent process, so our wrapper will use this function to create each environment after its process has been spawned. Let's look at an example for how to use the `SB3MultipleInstanceEnv` with the SB3 implementation of 
PPO to train an agent for 1,000,000 timesteps with 2 instances of the game open.

```python
# Here we import the Match object and our multi-instance wrapper
from rlgym.envs import Match
from rlgym_tools.sb3_utils import SB3MultipleInstanceEnv

# Since we can't use the normal rlgym.make() function, we need to import all the default configuration objects to give to our Match.
from rlgym.utils.reward_functions import DefaultReward
from rlgym.utils.obs_builders import DefaultObs
from rlgym.utils.state_setters import DefaultState
from rlgym.utils.terminal_conditions.common_conditions import TimeoutCondition

# Finally, we import the SB3 implementation of PPO.
from stable_baselines3.ppo import PPO

# This is the function we need to provide to our SB3MultipleInstanceEnv to construct a match. Note that this function MUST return a Match object.
def get_match():
    
    # Here we configure our Match. If you want to use custom configuration objects, make sure to replace the default arguments here with instances of the objects you want.
    return Match(
        reward_function=DefaultReward(),
        terminal_conditions=[TimeoutCondition(225)],
        obs_builder=DefaultObs(),
        state_setter=DefaultState()
        
        self_play=True,
    )
    

#If we want to spawn new processes, we have to make sure our program starts in a proper Python entry point.
if __name__ == "__main__":
    """
        Now all we have to do is make an instance of the SB3MultipleInstanceEnv and pass it our get_match function, the number of instances we'd like to open, and how long it should wait between instances.
        This wait_time argument is important because if multiple Rocket League clients are opened in quick succession, they will cause each other to crash. The exact reason this happens is unknown to us,
        but the easiest solution is to delay for some period of time between launching clients. The amount of required delay will depend on your hardware, so make sure to change this number if your Rocket League
        clients are crashing before they fully launch.
    """
    env = SB3MultipleInstanceEnv(match_func_or_matches=get_match, num_instances=2, wait_time=20)
    learner = PPO(policy="MlpPolicy", env=env, verbose=1)
    learner.learn(1_000_000)
```