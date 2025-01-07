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

A *return* $G$ is the cumulative reward obtained over a trajectory. In the finite-horizon case, the return is defined as $G_t = \sum_{t=1}^{t=T} r_t$. For infinite-horizon problems, we must introduce a *discount factor* $\gamma \in [0, 1)$ to form the *discounted return* $G_t = \sum_{t=1}^{t=\infty} \gamma^{t-1} r_t$.

The discount factor $\gamma$ serves two purposes. First, it ensures convergence of $G_t$ as $t \rightarrow \infty$ by forming a convergent geometric series when $|r_t|$ is bounded. Second, it acts as a from of temporal *credit assignment* by assigning more weight to rewards that were obtained closer to time $t$. 

## Value Functions

The *state value function*, often just called the *value function* $V : \mathcal{S} \rightarrow \mathbb{R}$ is a function that maps states to the *expected return* of a policy at that state. It is given by $V(s_t) = \mathbb{E}_{\pi}[G_t | s_t]$. This is an important quantity to understand because it captures the *quality* of a policy at a given state. It should be emphasized that the value function considers only one specific policy, so every time we make even a tiny change to our agent's policy, the value function will change as well. One way to envision the value function is to imagine the agent being dropped into the game at some arbitrary state $s$. The *value* of the policy at that state is the return it would get *on average* if we allowed it to play from that state infinitely many times, restarting from the same state each time a terminal state is reached.

The *state-action value function*, or *Q function* $Q : \mathcal{S} \times \mathcal{A} \rightarrow \mathbb{R}$ is a function that maps states and actions to the *expected return* of a policy at a state $s$ when the agent takes action $a$ at that state, then acts according to $\pi$ forever afterwards. It is given by $Q(s_t, a_t) = \mathbb{E}_{\pi}[G_t | s_t, a_t]$. This quantity is similar to $V(s)$, but with the caveat that the agent must first take the action $a_t$ at state $s_t$ before acting according to the policy $\pi$ forever afterwards. Note that $Q(s, a)$ can be written in terms of $V(s)$ as $Q(s, a) = V(s) + r + \gamma V(s')$.

The *state-action advantage function*, or *advantage function* $A : \mathcal{S} \times \mathcal{A} \rightarrow \mathbb{R}$, is the difference between the Q function and the value function at a state given an action. This is given by $A(s_t, a_t) = Q(s_t, a_t) - V(s_t)$. Think of the advantage function as a measure of how much better it was to take the action $a_t$ at state $s_t$ than it would have been to just act according to the policy $\pi$ at that state.

## Learning Process

Most learning algorithms consider an *objective function* $J(\pi)$, which is a function that maps a policy $\pi$ to a real number. The goal of learning is then to find a policy $\pi^*$ that maximizes the objective function, i.e. $J(\pi^*) = \max_{\pi} J(\pi)$. A convenient choice for $J$ would be any of the Q function, value function, or advantage function. For our purposes we will focus on the advantage function, because the Proximal Policy Optimization (PPO) algorithm uses that as an  bjective.
