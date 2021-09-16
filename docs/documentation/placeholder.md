## single instance example

The following example sets up a minimal stable baseline3 SingleEnv self play instance that uses PPO with the MlpPolicy

```python
# import the gym and stable baselines 3 libraries
import rlgym
from stable_baselines3.ppo import PPO
from rlgym_tools.sb3_utils import SB3SingleInstanceEnv

# setup the env
gym_env = rlgym.make(use_injector=True)
env = SB3SingleInstanceEnv(gym_env)

# create a PPO instance and start learning
learner = PPO(policy="MlpPolicy", env=env, verbose=1)
learner.learn(1_000_000)
```

## Multiple instances example

The stable baseline3 MultiEnv allows you to use multiple instances at the same time that train your model using self
play. And requires a more complex setup than the SingleEnv instance.

In the example we setup a MultiEnv that creates 2 instances using self-play.

```python
# import the gym, gym utils and stable baselines 3 libraries
from rlgym_tools.sb3_utils import SB3MultipleInstanceEnv
from rlgym.envs import Match
from rlgym.utils.reward_functions import DefaultReward
from rlgym.utils.obs_builders import DefaultObs
from rlgym.utils.state_setters import DefaultState
from rlgym.utils.terminal_conditions.common_conditions import TimeoutCondition
from stable_baselines3.ppo import PPO


# create a match object that will be passed to the instances
def get_match():
    return Match(
        self_play=True,
        reward_function=DefaultReward(),
        terminal_conditions=[TimeoutCondition(1000)],
        obs_builder=DefaultObs(),
        state_setter=DefaultState()
    )


if __name__ == "__main__":
    # create a MultiEnv instance and pass the required parameters
    env = SB3MultipleInstanceEnv(match_func_or_matches=get_match, num_instances=2, wait_time=20)
    learner = PPO(policy="MlpPolicy", env=env, verbose=1)
    learner.learn(1_000_000)
```

## SB3 arguments
Work in progress.

## callbacks
Work in progress.

## save a model

To save progress call the save() function of the learner.

```python
#imports omitted

gym_env = rlgym.make(use_injector=True)
env = SB3SingleInstanceEnv(gym_env)

learner = PPO(policy="MlpPolicy", env=env, verbose=1)
learner.learn(1_000_000)
learner.save("path/to/save/model_name")
```

## load a model

When using PPO loading is as easy as.

```python
# imports and get_match omitted

env = SB3MultipleInstanceEnv(match_func_or_matches=get_match, num_instances=2, wait_time=20)
env.reset()
learner = PPO.load("path/to/save/model_name", env=env)
learner.learn(1_000_000)
```

Note: use env.reset() before you resume training, or you will run into errors.

### load with different number of instances

Work in progress.
