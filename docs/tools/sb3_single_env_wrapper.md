---
title: SB3 with a Single Game Instance
---

## Using SB3 with a Single Game Instance

Unfortunately, SB3 does not natively support the concept of self-play. However, `rlgym-tools` provides a wrapper to get around this by treating each agent in a single match as though it were its own environment within SB3. With this, we can train more than one copy of our agent in one instance of the game through self-play. Let's see how we can set up an RLGym environment, wrap it in the `SB3SingleInstanceEnv`,  and use the SB3 implementation of PPO to train it with self-play for 1,000,000 timesteps.

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
