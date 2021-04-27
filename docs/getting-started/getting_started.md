## Setting up an environment
Once RLGym is [installed](https://rlgym.github.io/docs-page.html#section-1), simply import the library and call the `make()` function.
```python
import rlgym


env = rlgym.make("default")
```
This will configure Rocket League with the default parameters that come with RLGym.

The `make` function comes with a number of optional parameters, which are explained in the [Tutorials](https://rlgym.github.io/docs-page.html#section-3) section of the wiki.
For convenience, all the `make` parameters and their types are listed here:
- env_name: str,
- ep_len_minutes: float,
- game_speed: int,
- tick_skip: int,
- spawn_opponents: bool,
- random_resets: bool,
- team_size: int,
- terminal_conditions: List[object],
- reward_fn: object,
- obs_builder: object,
- path_to_rl: str,
- use_injector: bool

## Interacting with the game
To interact with the game, simply treat it like any other OpenAI Gym environment:

```python
import rlgym


env = rlgym.make("default")
obs = env.reset()
done = False

while not done:

  #Here we sample a random action. If you have an agent, you would get an action from it here.
  action = env.action_space.sample() 
  
  next_obs, reward, done, gameinfo = env.step(action)
  
  obs = next_obs
```

## Training an agent
You can now train an agent with your learning aglorithm of choice! RLGym natively supports [OpenAI Baselines](https://github.com/openai/baselines) - a library of common Reinforcement Learning algorithms.
The following is an example of how to train an agent in the default environment of RLGym using the Baselines of PPO
```python

import rlgym
import tensorflow as tf
from baselines.ppo2 import ppo2
from baselines.common import models
from baselines.common.vec_env.dummy_vec_env import DummyVecEnv


#2 layer MLP, 64 hidden nodes per layer, ReLU activation function.
net = models.mlp(num_layers=2, num_hidden=64, activation=tf.keras.activations.relu)

#Wrap RLGym in a VecEnv from baselines.
env = DummyVecEnv([lambda: rlgym.make("default")])

#Train!
ppo2.learn(network=net, env=env, total_timesteps=MAX_TIMESTEPS)
```

And just like that we are training a Rocket League agent! 

However, the default configuration of RLGym creates a trivial problem that will not produce a competent game-playing agent. The default RLGym environment simply punishes the agent at every step for having any angular velocity, and terminates after 15 seconds of in-game time have passed. We do this so users can quickly test if their learning algorithm can train anything in Rocket League at all, before moving on to the task they are interested in.

RLGym provides users the ability to broadly configure the way an environment is set up, so users can specify whatever problem they wish to solve in Rocket League. To learn about
configuring a custom environment, visit our [Tutorials](https://rlgym.github.io/docs-page.html#section-3) page.
