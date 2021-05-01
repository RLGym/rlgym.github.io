## Setting up an environment
Once RLGym is [installed](https://rlgym.github.io/docs-page.html#installation), simply import the library and call the `make()` function.
```python
import rlgym


env = rlgym.make("default")
```
This will configure Rocket League with the default parameters that come with RLGym.

The `make` function comes with a number of optional parameters, which are explained in the [Documentation](https://rlgym.github.io/docs-page.html#documentation) section of the wiki.
For convenience, all the `make` parameters and their types are listed here:
- env_name: str,
- ep_len_minutes: float,
- game_speed: int,
- tick_skip: int,
- spawn_opponents: bool,
- random_resets: bool,
- team_size: int,
- terminal_conditions: List[TerminalCondition],
- reward_fn: RewardFunction,
- obs_builder: ObsBuilder,
- path_to_rl: str,
- use_injector: bool

## Interacting with the game
To interact with the game, simply treat it like any other OpenAI Gym environment:

```python
import rlgym

env = rlgym.make("default")

while True:
    obs = env.reset()
    done = False

    while not done:
      #Here we sample a random action. If you have an agent, you would get an action from it here.
      action = env.action_space.sample() 
      
      next_obs, reward, done, gameinfo = env.step(action)
      
      obs = next_obs
```

## Training an agent
You can now train an agent with your learning aglorithm of choice! Because RLGym follows the OpenAI Gym API, any of the common Reinforcement Learning libraries should be supported.
The following is an example of how to train an agent in the default RLGym environment using an implementation of PPO from the [Stable Baselines 3](https://stable-baselines3.readthedocs.io/en/master/) library

```python
import rlgym
from stable_baselines3 import PPO

#Make the default rlgym environment
env = rlgym.make("default")

#Initialize PPO from stable_baselines3
model = PPO("MlpPolicy", env=env, verbose=1)

#Train our agent!
model.learn(total_timesteps=int(1e6))
```

And just like that we are training a Rocket League agent! 

Unfortunately the default configuration of RLGym will not produce a competent game-playing agent. This configuration is meant as a testing ground where users can quickly verify that they have installed RLGym successfully, and their learning algorithm is working. When the default reward is maximized, the agent should have zero angular velocity at all times.

To train a game playing agent, RLGym provides users the ability to broadly configure the way an environment is set up, so users can specify whatever problem they wish to solve in Rocket League. To learn about
configuring a custom environment, read through our [Tutorials](https://rlgym.github.io/docs-page.html#tutorials).
