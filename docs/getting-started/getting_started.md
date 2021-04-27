## Setting up an environment
Once RLGym is [installed](https://rlgym.github.io/docs-page.html#section-1), simply import the library and call the `make()` function.
```python
import rlgym

env = rlgym.make("default")
```
This will configure Rocket League with the default parameters that come with RLGym.

## Interacting with the game
To interact with the game, simply treat it like any other OpenAI Gym environment:

```python
import rlgym

env = rlgym.make("default")
done = False
obs = env.reset()

while not done:

  #Here we sample a random action. If you have an agent, you would get an action from it here.
  action = env.action_space.sample() 
  next_obs, reward, done, gameinfo = env.step(action)
  
  obs = next_obs
```

## Training an agent
You can now train an agent with your learning aglorithm of choice! However, the default configuration of RLGym configures a trivial 
problem that will not produce a competent game-playing agent. The default RLGym environment simply punishes the agent at every step for having any angular velocity, 
and terminates after 15 seconds of in-game time have passed. We do this so users can quickly test if their learning algorithm can train anything in Rocket League at all, 
before moving on to the task they are interested in.

RLGym provides users the ability to broadly configure the way an environment is set up, so users can specify whatever problem they wish to solve in Rocket League. To learn about
configuring a custom environment, visit our [Tutorials](https://rlgym.github.io/docs-page.html#section-3) page.
