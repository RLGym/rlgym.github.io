---
title: Reinforcement Learning Background
sidebar_position: 1
---

# 0. Reinforcement Learning Background

What follows is a series of definitions that may be useful to understand the concepts of reinforcement learning when training an agent in an RLGym environment. Note that these definitions are not meant to be exhaustive, and we will formulate the reinforcement learning setting in a somewhat non-standard way to better align with the environments typically considered by practitioners using RLGym.


## 1. The Basics

A *decision process* $\mathcal{P}$, sometimes called an *environment*, is characterized by a set of *states* $\mathcal{S}$, a set of *actions* $\mathcal{A}$, and a state transition probability function $\mathcal{T}(s' \mid s, a)$.
To interact with an environment, an agent must follow a *policy* $\pi \in \Pi$, where $\Pi$ denotes the set of admissible policies.

When an agent executes an *action* $a \in \mathcal{A}$ in state $s \in \mathcal{S}$, the environment transitions to a new state $s'$ according to $\mathcal{T}(s' \mid s, a)$.

For our purposes it is useful to further consider a set of *observations* $\mathcal{O}$, which are representations of states that an agent acts upon. The observation function $\mathbf{O} : \mathcal{S} \rightarrow \mathcal{O}$ maps states $s$ to observations $o$.

A *policy* $\pi : \mathbb{R}^{\mid\mathcal{O}\mid} \rightarrow \mathbb{R}^{\mid\mathcal{A}\mid}$ is a function that maps an observation $o$ to a real-valued vector, $\pi(o) \in \mathbb{R}^{\mid\mathcal{A}\mid}$.

In practice, a policy typically defines a distribution over actions. For discrete actions, $\pi$ directly outputs the probability mass for each action.
For continuous actions, the most common approach is for the policy to parameterize some known distribution (e.g. a Gaussian distribution) rather than try to directly learn the density of the action space. This is called the [reparameterization trick](https://en.wikipedia.org/wiki/Reparameterization_trick).

An *action function* $\mathbf{I} : \mathbb{R}^{\mid\mathcal{A}\mid} \rightarrow \mathcal{A}$ is a function that maps the output of a policy to an action.

The complete state-to-action mapping is given by $a = \mathbf{I}(\pi(\mathbf{O}(s)))$. We will refer to this mapping as an *agent*.

Following each action $a$ in state $s$, a *reward function* $\mathbf{R} : \mathcal{S} \times \mathcal{A} \rightarrow \mathbb{R}$ generates a scalar reward $r$.

We refer to a single interaction between the agent and the environment as a *timestep*, which contains $(s, a, r, s')$.

### 1.1 Trajectories and Returns

We are concerned with two types of sequences:
- A *trajectory*: Any sequence of timesteps from some state $s_t$ to another state $s_{t+n}$.
- An *episode*: A special case of trajectory that begins with an initial state $s_0$ and ends with a terminal state $s_T$.

We will denote such sequences of timesteps as $\tau = (s_t, a_t, r_t, s_{t+1}, a_{t+1}, r_{t+1}, \ldots, s_{t+n})$.

These sequences help characterize two types of problems we will deal with. The first case happens when all sequences of actions from any $s$ are guaranteed to eventually reach some terminal state $s_T$. We call these environments *episodic*, or *finite-horizon*, because interacting with them for long enough is guaranteed to eventually form an episode.
The second case happens when there are trajectories that will never end. That is, sequences of timesteps that never reach some $s_T$. We call these environments *non-episodic* or *infinite-horizon* because interacting with them forever is not guaranteed to form an episode. 

This distinction is important when we consider a *return* $G_j \in \mathbb{R}$, which is the cumulative reward obtained from timestep $j$ onward along a trajectory. There is one return per timestep.

In the simplest episodic case, the return from timestep $j$ can be written as
$$
G_j = \sum_{t=j}^{T-1} r_t.
$$ 
For non-episodic or infinite-horizon settings, we introduce a *discount factor* $\gamma \in [0, 1]$ and define the *discounted return from timestep* $j$ as
$$
G_j = \sum_{t=j}^{\infty} \gamma^{\,t-j} \, r_t
$$
Note that for finite-horizon episodic tasks, setting $\gamma = 1$ recovers the undiscounted return. 

The discount factor serves two purposes. First, it ensures that the infinite-horizon return converges so long as $0 \leq \gamma < 1$ by forming a convergent geometric series when $|{r_t}|$ is bounded. Second, it acts as a form of temporal *credit assignment* by assigning more weight to rewards that were obtained closer to the current time $t$. 

### 1.2 Value Functions

The *state value function*, often just called the *value function* $V : \mathcal{S} \rightarrow \mathbb{R}$ is a function that maps states to the *expected return* of a policy at that state. It is given by 
$$
V(s_t) = \mathbb{E}_{\pi}[G_t \mid s_t].
$$
This is an important quantity to understand because it captures the *quality* of a policy at a given state. It should be emphasized that the value function considers only one specific policy, so every time we make even a tiny change to our agent's policy, the value function will change as well. One way to envision the value function is to imagine the agent being dropped into the game at some arbitrary state $s$. The *value* of the policy at that state is the return it would get *on average* if we allowed it to play from that state infinitely many times, restarting from the same state each time a terminal state is reached.

The *state-action value function*, or *Q function* $Q : \mathcal{S} \times \mathcal{A} \rightarrow \mathbb{R}$ is a function that maps states and actions to the *expected return* of a policy at a state $s$ when the agent takes action $a$ at that state, then acts according to $\pi$ forever afterwards. It is given by 
$$
Q(s_t, a_t) = \mathbb{E}_{\pi}[G_t \mid s_t, a_t].
$$
This quantity is similar to $V(s)$, but with the caveat that the agent must first take the action $a_t$ at state $s_t$ before acting according to the policy $\pi$ forever afterwards. Note that, in general, we can write $Q(s, a)$ in terms of $V(s)$ as
$$
Q(s_t, a_t) = \mathbb{E}[\, r_t + \gamma \, V(s_{t+1}) \mid s_t, a_t \,].
$$

The *state-action advantage function*, or *advantage function* $A : \mathcal{S} \times \mathcal{A} \rightarrow \mathbb{R}$, is the difference between the Q function and the value function at a state given an action. This is given by 
$$
A(s_t, a_t) = Q(s_t, a_t) - V(s_t).
$$
Think of the advantage function as a measure of how much better it was to take the action $a_t$ at state $s_t$ than it would have been to just act according to the policy $\pi$ at that state.


## 2. The Learning Process
This section will outline the general process of learning a policy from a set of trajectories. The derivation of the policy gradient shown here comes from OpenAI's [Spinning Up blog](https://spinningup.openai.com/en/latest/spinningup).


Most learning algorithms optimize an *objective* $J: \Pi \rightarrow \mathbb{R}$; for $\pi \in \Pi$, $J(\pi) = \mathbb{E}_{\pi}[G_0]$ (where $G_0$ denotes the return starting at time $0$).
The goal of learning is then to find a policy $\pi^*$ that maximizes the objective function, i.e. $J(\pi^*) = \max_{\pi \in \Pi} J(\pi)$. For our purposes we care about the objective $J(\pi) = \mathbb{E}_{\pi}[G_0]$. However, there are many options.

The most common way to maximize this function is a process called *gradient ascent* (though you may have heard of gradient *descent*, the concepts are the same), which is an iterative process by which a policy is repeatedly adjusted in the direction of the gradient of the objective function $\nabla J(\pi)$.
To do this in practice we will only consider policies that are differentiable functions parameterized by $\theta \in \mathbb{R}^d$, which we will write as $\pi_{\theta}$.

### 2.1 The Policy Gradient
This formulation of the policy and objective allows us to write an update rule for any parameters $\theta_u$ by gradient ascent on $J$, 

$$
\theta_{u+1} = \theta_u + \eta \nabla_{\theta_{u}} J(\pi_{\theta_u}).
$$
where $0 < \eta < \infty$ is referred to as the *learning rate*.

To derive $\nabla_{\theta} J(\pi_{\theta})$ we will first rewrite our objective $\mathbb{E}_{\pi_{\theta}}[G_0]$ in integral form as 
$$
\mathbb{E}_{\pi_{\theta}}[G_0] = \int_{\tau} P(\tau \mid \pi_{\theta}) \, G_{0}(\tau) \, d\tau.
$$

Note that to evaluate this integral we need to know $P(\tau \mid \pi_{\theta})$, which is the probability of a trajectory occurring under $\pi_{\theta}$. For a trajectory of length $T$ this is given by

$$
P(\tau \mid \pi_{\theta}) = P(s_0) \prod_{t=0}^{T-1} \big[\, \pi_{\theta}(a_t \mid s_t) \, P(s_{t+1} \mid s_t, a_t) \,\big].
$$

That is, the probability of a trajectory given a policy is the product of the probabilities of each state transition and the probabilities of each action taken over that trajectory. This would be cumbersome to differentiate on its own, 
but because $P(\tau \mid \pi_{\theta})$ specifies a probability function, we can employ the [log-derivative trick](https://andrewcharlesjones.github.io/journal/log-derivative.html) to get
$$
\nabla_{\theta} P(\tau \mid \pi_{\theta}) = P(\tau \mid \pi_{\theta}) \nabla_{\theta} \log P(\tau \mid \pi_{\theta}).
$$
This may not seem useful at first, but $\log P(\tau \mid \pi_{\theta})$ separates that nasty product from earlier into a summation:
$$
\log P(\tau \mid \pi_{\theta}) = \log P(s_0) + \sum_{t=0}^{T-1} \big[\, \log \pi_{\theta}(a_t \mid s_t) + \log P(s_{t+1} \mid s_t, a_t) \,\big].
$$
This means we can differentiate each term of $\log P(\tau \mid \pi_{\theta})$ with respect to $\theta$ to get its gradient,
and neither $P(s_0)$ or $P(s_{t+1} \mid s_t, a_t)$ are functions of $\theta$, so their contribution to $\nabla_{\theta} \log P(\tau \mid \pi_{\theta})$ is zero.
Therefore, we can write its gradient as
$$
\nabla_{\theta} \log P(\tau \mid \pi_{\theta}) = \sum_{t=0}^{T-1} \nabla_{\theta} \log \pi_{\theta}(a_t \mid s_t).
$$
Circling back to our goal of finding $\nabla_{\theta} P(\tau \mid \pi_{\theta})$, we have 
$$
\nabla_{\theta} P(\tau \mid \pi_{\theta}) = P(\tau \mid \pi_{\theta}) \sum_{t=0}^{T-1} \nabla_{\theta} \log \pi_{\theta}(a_t \mid s_t).
$$
Finally we can plug this back into the integral form of our objective as above to get
$$
\begin{aligned}
\nabla_{\theta} J(\pi_{\theta}) &= \int_{\tau} \nabla_{\theta} P(\tau \mid \pi_{\theta}) \, G_{0}(\tau) \, d\tau. \\
&= \int_{\tau} P(\tau \mid \pi_{\theta}) \, \nabla_{\theta} \log P(\tau \mid \pi_{\theta}) \, G_{0}(\tau) \, d\tau. \\
&= \mathbb{E}_{\pi_{\theta}}\Big[\, \sum_{t=0}^{T-1} \nabla_{\theta} \log \pi_{\theta}(a_t \mid s_t) \, G_t \,\Big].
\end{aligned}
$$
Putting this together, we can approximate $\nabla_{\theta} J(\pi_{\theta})$ over a group of $B$ timesteps as
$$
\nabla_{\theta} J(\pi_{\theta}) \approx \frac{1}{B} \sum_{t=1}^{B} \nabla_{\theta} \log \pi_{\theta}(a_t \mid s_t) G_t.
$$
Note that $B$ is typically referred to as the *batch size*. Larger batch sizes will yield more accurate gradient estimates, but will also require more memory and time to compute.

One interesting property of this gradient is that it requires the probability of any action in a batch according to the policy to be non-zero ($\log 0$ is undefined) and also not equal to one ($\log 1 = 0$). For this estimator of the policy gradient, the policy should be stochastic so that $\log \pi(a_t \mid s_t)$ is well-defined and informative. Deterministic policies can be handled by different estimators.
### 2.2 Baselines and The Critic
When approximating $\nabla_{\theta} J(\pi_{\theta})$ as we derived above, we might run into a problem in settings where returns have a high variance. We would rather find a method to estimate $\nabla_{\theta} J(\pi_{\theta})$ that is less sensitive to the variance of returns. To do this, we will introduce a *baseline* $b(s)$, which is any function of the state (not dependent on the action), into our approximation:
$$
\nabla_{\theta} J(\pi_{\theta}) \approx \frac{1}{B} \sum_{t=1}^{B} \nabla_{\theta} \log \pi_{\theta}(a_t \mid s_t) (G_t - b(s_t)).
$$
A comprehensive analysis of $b(s)$ and what it should be is beyond the scope of this article, but the key concept to understand is that because $b(s)$ only depends on the state, it does not change the expectation of our gradient estimate at all:
$$
\begin{aligned}
\mathbb{E}_{\pi_{\theta}}\Big[ \, \nabla_{\theta} \log \pi_{\theta} (a_t \mid s_t) \, b(s_t) \Big] &= 0 \\
\therefore
\mathbb{E}_{\pi_{\theta}}\Big[ \, \nabla_{\theta} \log \pi_{\theta} (a_t \mid s_t) \, (G_t - b(s_t)) \Big] &= \mathbb{E}_{\pi_{\theta}}\Big[\nabla_{\theta} \log \pi_{\theta}(a_t \mid s_t) \, G_t \Big].
\end{aligned}
$$
However, $b(s)$ does change the variance of the gradient estimator. It turns out that a near-optimal choice of baseline (and the one we will use going forward) is $V(s)$. One way we can intuit the usefulness of this choice is to think of $G_t$ as how the agent actually performed at the state $s_t$, and $V(s_t)$ as how
the agent was expected to perform at that state, so we are weighting the gradient estimate such that it points away from actions that led to below-average performance and towards actions that led to above-average performance.

Now that we are equipped with a baseline, we need to figure out how to compute it. Since $V(s)$ is an expectation,
we could try to approximate it by visiting every $s_t$ many times and taking the average of the returns we get, but this is obviously impractical
for environments with more than a few states. Instead, we will parameterize a function to approximate $V(s)$ and optimize it by [least squares regression](https://en.wikipedia.org/wiki/Least_squares).

Thankfully, learning a model of $V(s)$ is much easier than learning $\pi$. We will denote our model $v_{\phi}(s)$ with parameters $\phi \in \mathbb{R}^c$.
Our objective is then to learn $\phi^*$ such that $v_{\phi^*}(s_t) = V(s_t)$. Because $V(s)$ is an expectation of returns according to $\pi$, we can consider each $G_t$ a Monte Carlo sample from the distribution of returns under $\pi$.
Therefore, we can approximate $\phi^*$ by performing gradient descent on 

$$
J_{\phi}(s_t) = \mathbb{E}[(G_t - v_{\phi}(s_t))^2].
$$

### 2.3 Value Targets and TD($\lambda$)
While what we have done so far is a valid way to compute value targets, we will encounter some issues in practice. Right now to train our critic we need to traverse a full trajectory in order to compute even one $G_t$. In episodic environments with long episodes this can be impractical, and it is clearly impossible to do in non-episodic environments.
To deal with these problems we need to introduce the famous [Bellman equation](https://en.wikipedia.org/wiki/Bellman_equation), which describes a recursive relationship between $V(s_t)$ and $V(s_{t+1})$.
The Bellman equation rewrites the value function as follows:
$$
\begin{aligned}
V(s_t) &= \mathbb{E}_{\pi}[G_t \mid s_t] \\
       &= \mathbb{E}_{\pi}[r_t + \gamma G_{t+1} \mid s_t] \\
       &= \mathbb{E}_{\pi}[r_t] + \gamma V(s_{t+1}).
\end{aligned}
$$
Which, so long as the reward function is deterministic, is equal to
$$
V(s_t) = r_t + \gamma V(s_{t+1}).
$$
This is the Bellman equation.
As you can see, this creates a recursive definition of the value function, where we can compute the value of one state as the sum of the reward at the current state and the value of the next.
Further, we can write similar equations for $V(s_t)$ with up to as many $r_t$ terms as there are timesteps in a trajectory. All of the following are equal:
$$
\begin{aligned}
V(s_t) &= r_t + \gamma V(s_{t+1}) \\
       &= r_t + \gamma r_{t+1} + \gamma^2 V(s_{t+2}) \\
       &= r_t + \gamma r_{t+1} + \gamma^2 r_{t+2} + \gamma^3 V(s_{t+3}). \\
       &\vdots
\end{aligned}
$$
When we chose the value function as our baseline earlier, we approximated it by least squares regression on the returns $G_t$. However, because all of these expansions are equal,
it would be just as valid to train our critic by regression on any of these expansions of the Bellman equation. 
To make our lives easier let us rephrase the learning objective for the critic more generally as
$$
J_{\phi}(s_t) = \mathbb{E}_{\pi}[ (\hat{v}_t - v_{\phi}(s_t))^2 ]
$$
where $\hat{v}_t$ is the learning target for $v_{\phi}(s_t)$, which we previously set to $\hat{v}_t = G_t$. Let us now rewrite the above equalities
and replace each $V(s)$ with $v_{\phi}(s_t)$. For convenience, we will label each expansion of the Bellman equation as $V^{(n)}_t$ where $n$ is the number of $r_t$ terms in the calculation, like so:
$$
\begin{aligned}
V^{(1)}_t &= r_t + \gamma v_{\phi}(s_{t+1}) \\
V^{(2)}_t &= r_t + \gamma r_{t+1} + \gamma^2 v_{\phi}(s_{t+2}) \\
V^{(3)}_t &= r_t + \gamma r_{t+1} + \gamma^2 r_{t+2} + \gamma^3 v_{\phi}(s_{t+3}). \\
&\vdots
\end{aligned}
$$
The question we are now faced with is which $V^{(n)}_t$ to choose as a replacement for $G_t$ in our critic target. 
We could choose $\hat{v}_t = V^{(1)}_t$, or $\hat{v}_t = V^{(2)}_t$, or $\hat{v}_t = V^{(3)}_t$, etc, but the key insight behind TD($\lambda$) 
is that we can take an average over all $V^{(n)}_t$ rather than just choose one:
$$
\hat{v_t} = \frac{1}{n} \sum_{i=1}^n V^{(i)}_t.
$$
This would work fine, but another important aspect to consider is the variance in each expansion $V^{(n)}_t$. 
Because there is variance in the returns, $V^{(n)}_t$ with fewer $r_t$ terms will have less variance. However, this also means
$v_{\phi}(s_t)$ has a larger influence over those $V^{(n)}_t$, and the critic is an imperfect estimator of $V(s)$, so there
will be a higher bias in those $V^{(n)}_t$. These facts outline a trade-off between variance and bias in our value targets;
the more $r_t$ terms we use, the higher the variance, but the lower the bias. TD($\lambda$) addresses this trade-off by
choosing a weighted average of all $V^{(n)}_t$ expansions, where the weight of each term is given by $\lambda^{n-1}$.
$$
\hat{v_t} = (1 - \lambda) (V^{(1)}_t + \lambda V^{(2)}_t + \lambda^2 V^{(3)}_t + \lambda^3 V^{(4)}_t + \ldots).
$$

Choosing $\hat{v_t}$ in this fashion gives us a single parameterized method of estimating $V(s_t)$ from a single trajectory that encompasses all the ways we
might expand the Bellman equation, where $\lambda \in [0, 1)$ controls the relative amounts of bias and variance in the learning targets.