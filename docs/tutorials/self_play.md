## Multiple Agents

In many cases, having an agent play against itself, or against other agents, may be crucial to the training process. RLGym supports this natively with 1v1, 2v2, and 3v3 game modes. To spawn and control multiple agents, change the `spawn_opponents` argument in `rlgym.make()` to `True`. Similarly, to change the team size, specify the `team_size` argument in `rlgym.make()`. When there are multiple agents in a single match, a user must provide one input per agent. RLGym will then provide one reward and one observation per agent at every step in response.

To get an understanding of how things change when we add multiple agents, we will first look at the shapes of data returned by the default reward function and observation builder when only a single agent is present in the match.
```python
>>> import rlgym
>>> import numpy as np
>>> 
>>> 
>>> env = rlgym.make(team_size=1)
>>> obs = env.reset()
>>> 
>>> action = env.action_space.sample()
>>> new_obs, reward, done, game_info = env.step(action)
>>> 
>>> print("Reward: {} | Reward Shape: {} | Observation Shape: {}".format(reward, np.shape(reward), np.shape(new_obs)))
'Reward: 0.22926727739572525 | Reward Shape: () | Observation Shape: (21,)'
>>> 
>>> env.close()
```

Now we want to spawn a second agent that we control by enabling changing the `spawn_opponents` flag. When we do this, RLGym will expect us to provide 2 actions, and we expect it will give us 2 rewards and 2 observations at each step. Let's see how this changes the shape of our rewards and observations.
```python
>>> import rlgym
>>> import numpy as np
>>> 
>>> 
>>> env = rlgym.make(spawn_opponents=True, team_size=1)
>>> obs = env.reset()
>>> 
>>> action1 = env.action_space.sample()
>>> action2 = env.action_space.sample()
>>> actions = [action1, action2]
>>> new_obs, reward, done, game_info = env.step(actions)
>>> 
>>> print("Reward: {} | Reward Shape: {} | Observation Shape: {}".format(reward, np.shape(reward), np.shape(new_obs)))
'Reward: [0.22909658008217812, -0.000620309618115425] | Reward Shape: (2,) | Observation Shape: (2, 30)'
>>>
>>> env.close()
```
We can see that RLGym has given us a list of 2 rewards and 2 observations, just as we expected. Interestingly, the length of each observation has changed from 21 to 30. This is because the `DefaultObs` class will expand the length of an observation to fit more players as we add them.

Note that `RewardFunction` and `ObsBuilder` objects accept a `PlayerData` object when computing a reward and building an observation. The purpose of this is to allow users to construct rewards and observations for each agent individually, rather than using the same logic across all agents.
The order of the rewards and observations at each step is the same as the order of the actions that were passed in.

e.g.
```python
new_obs[0], reward[0] -> actions[0]
new_obs[1], reward[1] -> actions[1]
```

The behavior of RLGym will continue in this fashion if we want to add more players to each team. Below is an example of a 3v3 game with 3 agents per team.
```python
>>> import rlgym
>>> import numpy as np
>>> 
>>> team_size = 3
>>> env = rlgym.make(spawn_opponents=True,
>>>                  team_size=team_size)
>>> obs = env.reset()
>>> 
>>> actions = []
>>> for i in range(team_size*2):
>>>     action_i = env.action_space.sample()
>>>     actions.append(action_i)
>>> 
>>> new_obs, reward, done, game_info = env.step(actions)
>>> 
>>> print("Reward: {} | Reward Shape: {} | Observation Shape: {}".format(reward, np.shape(reward), np.shape(new_obs)))
'Reward: [-0.0004967440903186798, -0.00022574408054351803, -0.00045004554688930515, -0.00045091726481914524, -0.00044998391568660737, -0.00045094705224037174] | Reward Shape (6,) | Observation Shape: (6, 66)'
>>> env.close()
```
