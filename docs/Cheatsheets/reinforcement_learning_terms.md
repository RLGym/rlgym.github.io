---
title: Reinforcement Learning Background
sidebar_position: 1
---

# Reinforcement Learning Background

What follows is a series of definitions that may be useful to understand the concepts of reinforcement learning that are used when training an agent in an RLGym environment. Note that these definitions are not meant to be exhaustive, and we will formulate the reinforcement learning setting in a somewhat non-standard way to better align with the environments typically considered by practitioners using RLGym.


## The Basics

A *decision process* $\mathcal{P}$, sometimes called an *environment*, is characterized by a set of *states* $\mathcal{S}$, a set of *actions* $\mathcal{A}$, and a state transition probability function $\mathcal{T}(s' | s, a)$.

When an agent executes an *action* $a \in \mathcal{A}$ in state $s \in \mathcal{S}$, the environment transitions to a new state $s'$ according to $\mathcal{T}(s' | s, a)$.

For our purposes it is useful to further consider a set of *observations* $\mathcal{O}$, which are representations of states that an agent acts upon. The observation function $\mathbf{O} : \mathcal{S} \rightarrow \mathcal{O}$ maps states $s$ to observations $o$.

A *policy* $\pi : \mathbb{R}^{|\mathcal{O}|} \rightarrow \mathbb{R}^{|\mathcal{A}|}$ is a function that maps an observation $o$ to a real-valued vector, $\pi(o) \in \mathbb{R}^{|\mathcal{A}|}$.

An *action function* $\mathbf{I} : \mathbb{R}^{|\mathcal{A}|} \rightarrow \mathcal{A}$ is a function that maps the output of a policy to an action.

The complete state-to-action mapping is given by $a = \mathbf{I}(\pi(\mathbf{O}(s)))$. We will refer to this mapping as an *agent*.

Following each action $a$ in state $s$, a *reward function* $\mathbf{R} : \mathcal{S} \times \mathcal{A} \rightarrow \mathbb{R}$ generates a scalar reward $r$.

We refer to a single interaction between the agent and the environment as a *timestep*, which contains $(s, a, r, s')$.

## Trajectories and Returns

We are concerned with two types of sequences:
- An *episode*: A complete sequence of timesteps starting from an initial state $s_0$ and ending with a terminal state $s_T$
- A *trajectory*: Any sequence of timesteps from some arbitrary state $s_t$ to $s_{t+n}$
If all sequences of actions from any $s_t$ are guaranteed to eventually reach some terminal state $s_T$, we refer to this as a *finite-horizon problem*. If instead we allow the trajectory to continue indefinitely, we refer to this as an *infinite-horizon problem*.

A *return* $G$ is the cumulative reward obtained over a trajectory. In the finite-horizon case, the return is can be written simply as 
$$
G_t = \sum_{t=1}^{t=T} r_t.
$$ 
However, to account for infinite-horizon problems, we must introduce a *discount factor* $\gamma \in [0, 1]$ to form the *discounted return* 
$$
G_t = \sum_{t=1}^{t=\infty} \gamma^{t-1} r_t.
$$
Note that this reduces back to our first equation for $G_t$ when $\gamma = 1$. This discount factor serves two purposes. First, it ensures convergence of $G_t$ as $t \rightarrow \infty$ so long as $0 \leq \gamma < 1$  by forming a convergent geometric series when $|r_t|$ is bounded. Second, it acts as a from of temporal *credit assignment* by assigning more weight to rewards that were obtained closer to the current time $t$. 

## Value Functions

The *state value function*, often just called the *value function* $V : \mathcal{S} \rightarrow \mathbb{R}$ is a function that maps states to the *expected return* of a policy at that state. It is given by 
$$
V(s_t) = \mathbb{E}_{\pi}[G_t | s_t].
$$
This is an important quantity to understand because it captures the *quality* of a policy at a given state. It should be emphasized that the value function considers only one specific policy, so every time we make even a tiny change to our agent's policy, the value function will change as well. One way to envision the value function is to imagine the agent being dropped into the game at some arbitrary state $s$. The *value* of the policy at that state is the return it would get *on average* if we allowed it to play from that state infinitely many times, restarting from the same state each time a terminal state is reached.

The *state-action value function*, or *Q function* $Q : \mathcal{S} \times \mathcal{A} \rightarrow \mathbb{R}$ is a function that maps states and actions to the *expected return* of a policy at a state $s$ when the agent takes action $a$ at that state, then acts according to $\pi$ forever afterwards. It is given by 
$$
Q(s_t, a_t) = \mathbb{E}_{\pi}[G_t | s_t, a_t].
$$
This quantity is similar to $V(s)$, but with the caveat that the agent must first take the action $a_t$ at state $s_t$ before acting according to the policy $\pi$ forever afterwards. Note that $Q(s, a)$ can be written in terms of $V(s)$ as 
$$
Q(s_t, a_t) = r_t + \gamma V(s_{t+1}).
$$

The *state-action advantage function*, or *advantage function* $A : \mathcal{S} \times \mathcal{A} \rightarrow \mathbb{R}$, is the difference between the Q function and the value function at a state given an action. This is given by 
$$
A(s_t, a_t) = Q(s_t, a_t) - V(s_t).
$$
Think of the advantage function as a measure of how much better it was to take the action $a_t$ at state $s_t$ than it would have been to just act according to the policy $\pi$ at that state.


## The Learning Process

Most learning algorithms consider an *objective function* $J(\pi)$, which is a function that maps a policy $\pi$ to a real number. The goal of learning is then to find a policy $\pi^*$ that maximizes the objective function, i.e. $J(\pi^*) = \max_{\pi} J(\pi)$. A convenient choice for $J$ would be any of the Q function, value function, or advantage function. For our purposes we will focus on the advantage function, because the Proximal Policy Optimization (PPO) algorithm uses that as an  bjective.


## Generalized Advantage Estimation

A common point of confusion to users of PPO is the [Generalized Advantage Estimation](https://arxiv.org/pdf/1506.02438) (GAE) algorithm, which was written by Schulman et. al in 2015, and published at ICLR 2016.

Before we begin, be aware that I will be writing this explanation of GAE from the perspective of the *value function* $V(s)$, rather than the *advantage function* $A(s, a)$, but everything I say here can be said about $A(s, a)$ as well. I chose this because I think it's easier to understand GAE for its use in computing stable targets for our critic, rather than stable advantages for our policy.

To understand how GAE works, we first need to understand an interesting fact about the value function - that it can be written in terms of itself. Consider the following equalities:
$$
\begin{aligned}
V(s_t) &= \mathbb{E}_{\pi}[G_t | s_t] \\
       &= \mathbb{E}_{\pi}[R(s_t, a) + \gamma G_{t+1} | s_t] \\
       &= \mathbb{E}_{\pi}[R(s_t, a)] + \gamma V(s_{t+1}).
\end{aligned}
$$
Which, so long as the reward function is deterministic, is equivalent to
$$
V(s_t) = r_t + \gamma V(s_{t+1}).
$$
As you can see, we can write $V(s_t)$ either as the expectation of the return at the current state, or as the sum of the reward and the discounted value of the next state. Further, we can write similar equations for $V(s_t)$ with as many $r_t$ terms as we want. All of the following are equivalent:
$$
\begin{aligned}
V(s_t) &= r_t + \gamma V(s_{t+1}) \\
       &= r_t + \gamma r_{t+1} + \gamma^2 V(s_{t+2}) \\
       &= r_t + \gamma r_{t+1} + \gamma^2 r_{t+2} + \gamma^3 V(s_{t+3}). \\
       &\vdots
\end{aligned}
$$
These equalities are important because they show us that there are as many ways to write $V(s_t)$ as there are timesteps in a trajectory. We care about that because, in practice, we don't know the actual value of $V(s_t)$ for any state. Instead, we collect one trajectory at a time, and consider the return we calculate from each timestep as a *sample* from the return distribution at that state. We then train our critic $v(s)$ to predict the return we calculate for each state. This works because when we encounter the same state more than once we'll get a different return for it, so the critic will learn to predict the average return at that state. If we do this enough times, the critic will learn to predict the true value function.

However, when training the critic, one might look at the above equivalent ways of writing $V(s_t)$ and wonder, "which of these equations should I train the critic to predict?" To answer that question we will first rewrite the above equations by denoting each form of $V(s_t)$ as $V^{n}_t$, and we will introduce our critic to the calculation by replacing $V(s)$ with $v(s)$:
$$
\begin{aligned}
V^{(1)}_t &= r_t + \gamma v(s_{t+1}) \\
V^{(2)}_t &= r_t + \gamma r_{t+1} + \gamma^2 v(s_{t+2}) \\
V^{(3)}_t &= r_t + \gamma r_{t+1} + \gamma^2 r_{t+2} + \gamma^3 v(s_{t+3}). \\
&\vdots
\end{aligned}
$$
Note that this means every $V^{(n)}_t$ is not the actual output of the value function at $s_t$, because the critic $v(s_t)$ is only an approximation of the correct value. Next, recall that we train our critic to predict some target value $\hat{v}$ by minimizing the mean-squared error between the predicted value $v(s)$ and $\hat{v}$. That is, we minimize the loss $L = \frac{1}{B} \sum_{i=1}^B [v(s_i) - \hat{v_i}]^2$ where $B$ is the batch size.

With this in mind, GAE is somewhat an exercise in choosing the target value $\hat{v}$. We could choose the target value to be $V^{(1)}_t$, or $V^{(2)}_t$, or $V^{(3)}_t$, etc, so which should we choose? The key insight behind GAE is that we can choose the average over all of them:
$$
\hat{v_t} = \frac{1}{n} \sum_{i=1}^n V^{(i)}_t.
$$
This would work fine, but another insight made by Schulman et. al is that, as mentioned earlier, each time we compute $G_t$ from the same state $s_t$ the results might be different. This is because if we let an agent play a game from some state $s_t$ many times it may choose different actions each time, so the resulting trajectories might be different, which means the returns we calculate at $s_t$ might be different. In contrast to this, our estimate of the value function (the critic) $v(s_t)$ is computed by a deterministic neural network, so it will give us the same output no matter how many times we feed it the same state.

Knowing that, we might consider $V^{(1)}_t$ to be an estimation of $V(s_t)$ that has a *low variance* because it only uses a single reward $r_t$ in the calculation, but in exchange it has a *high bias* because the critic $v(s_t)$ has a lot of influence over the final calculation, and it will almost always be incorrect. In contrast, we might consider $V^{(n)}_t$ to be an estimation of $V(s_t)$ that has a *high variance* because it uses all the possible $r_t$ terms in the calculation, but in exchange it has a *low bias* because the critic $v(s_t)$ is not used until the very end of the calculation.

It seems then that it might be useful to introduce a way to weight each $V^{(n)}_t$ term by some factor $\lambda \in [0, 1]$ so we can choose how to balance the trade-off between bias and variance. Schulman et. al do this by computing an exponential average of the $V^{(n)}_t$ terms instead of the arithmetic mean like we did above. This results in an equation that is remarkably similar to the discounted return, but with $\lambda$ in place of $\gamma$ and $V^{(n)}_t$ in place of $r_t$.
$$
\hat{v_t} = (1 - \lambda) (V^{(1)}_t + \lambda V^{(2)}_t + \lambda^2 V^{(3)}_t + \lambda^3 V^{(4)}_t + \ldots).
$$
And that's it! Now we can change the value of $\lambda$ to control the trade-off between bias and variance in the value targets. Higher values of $\lambda$ lead to more variance but less bias, and vice versa. The GAE paper does a little more algebra to rearrange the above equation in a way that is easier to compute, but the idea is the same.

Writing the equation for $\hat{v_t}$ in this fashion gives us a single parameterized method of estimating $V(s_t)$ from a single trajectory that encompasses all the ways we might write $V^{(n)}_t$. Because of this, it is a *general* way to estimate $V(s_t)$, so we call it a *generalized value estimator*, and if we had used the advantage function instead of the value function in this section we would have called it a generalized advantage estimator, like the paper. If you're interested in learning more about GAE, check out the [paper](https://arxiv.org/pdf/1506.02438) by Schulman et. al.

