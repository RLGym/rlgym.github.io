## Multiple Agents

For many cases, having an agent play against itself, or against other agents, may be crucial to the training process. RLGym supports this natively with self-play, 2v2, and 3v3 game modes.
To enable self-play, simply append the keyword "self" to the name of your environment (e.g. change "default" to "default self"). To change the team size, specify the `team_size` argument in the parameters of `rlgym.make()`.
When there are multiple agents in a single match, a user must provide one input per agent. In response, RLGym will provide one reward and one observation per agent at every step.

Let's examine how the shape of things change when we add multiple agents. First, we will look at the shape of things when only a single agent is present in the match.
```python
>>> import rlgym
>>> import numpy as np
>>> 
>>> 
>>> env = rlgym.make("default")
>>> obs = env.reset()
>>> 
>>> action = env.action_space.sample()
>>> new_obs, reward, done, game_info = env.step(action)
>>> 
>>> print("Reward: {} | Reward Shape: {} | Observation Shape: {}".format(reward, np.shape(reward), np.shape(new_obs)))
>>> 'Reward: 0.22926727739572525 | Reward Shape: () | Observation Shape: (21,)'
>>> 
>>> env.close()
```

Now we want to spawn a second agent into our game as an opponent that we also control by enabling self-play. When we do this, RLGym will expect us to provide 2 actions, and we expect it will give us 2 rewards and 2 observations.
```python
>>> import rlgym
>>> import numpy as np
>>> 
>>> 
>>> env = rlgym.make("default self")
>>> obs = env.reset()
>>> 
>>> action1 = env.action_space.sample()
>>> action2 = env.action_space.sample()
>>> actions = [action1, action2]
>>> new_obs, reward, done, game_info = env.step(actions)
>>> 
>>> print("Reward: {} | Reward Shape: {} | Observation Shape: {}".format(reward, np.shape(reward), np.shape(new_obs)))
>>> 'Reward: [0.22909658008217812, -0.000620309618115425] | Reward Shape: (2,) | Observation Shape: (2, 30)'
>>>
>>> env.close()
```
