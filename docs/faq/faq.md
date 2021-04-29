#### How do I train a bot with RLGym?

RLGym is an interface to Rocket League that follows the [OpenAI Gym API](https://gym.openai.com/). It is up to you to use a learning algorithm to train an agent in RLGym.

***

#### How long will it take for my bot to become superhuman?

That depends on how much time and money you have. [OpenAI Five](https://openai.com/blog/openai-five/) trained for 54,000 *years* worth of time, so you should expect Rocket League
to take an enormous amount of compute and time.

***

#### Can I train my bot against RLBot agents?

Not at the moment, but it should be possible to write a wrapper that transforms RLGym data into an RLBot game packet.

***

#### Can I train my bot against Psyonix agents?

By default, when you build an RLGym environment with the parameters `spawn_opponents=True` and `self_play=False`, all-star Psyonix bots will be spawned as opponents for however
many players there are per team. Unfortunately, the Psyonix bots appear to become much worse when the game is sped up dramatically, so it is difficult to meaningfully train against them.

***

#### Have you tried this or that learning algorithm?

Many people have used a variety of learning algorithms for a wide range of problems in Rocket League with varying levels of success. If you want to know how one particular method
would perform on one particular problem, try it out!

***

#### Can rendering be disabled?

No. The physics engine and rendering engine in Rocket League are inextricably linked. However, if you run the game in windowed mode and simply minimize the window, rendering will be
disabled by Psyonix.

***

#### What should my reward function be?

It's impossible to say what the best reward is for a given problem. In theory, the most sparse reward possible can yield an optimal agent with many learning algorithms. However,
it may take an impractical amount of time to train an agent with a very sparse reward. In general, you should try to craft a reward function that provides as little information as possible,
while still providing information frequently enough that an agent can easily pick up on it.

***

#### Can I train the same agent to play 1v1, 2v2, and 3v3?

You can, but you will need to find a way to handle the change in the number of players present in the game. One user has already had success doing this with an [Attention Mechanism](https://en.wikipedia.org/wiki/Attention_(machine_learning)) which
you can find [here](https://github.com/Rolv-Arild/EARL-pytorch).
