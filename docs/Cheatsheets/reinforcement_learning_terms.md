---
title: Reinforcement Learning Background
sidebar_position: 1
---

# Reinforcement Learning Background
What follows is a series of definitions that may be useful to understand the concepts of reinforcement learning that are used when training an agent in an RLGym environment. Note that these definitions are not meant to be exhaustive, and we will formulate the reinforcement learning setting in a somewhat non-standard way to better align with the environments typically considered by practitioners using RLGym.

## The Basics

A *decision process* $\mathcal{P}$, sometimes called an *environment*, is defined by a set of *states* $\mathcal{S}$, a set of *actions* $\mathcal{A}$, and a state transition probability function $\mathcal{T}(s' | s, a)$.

An *action* $a \in \mathcal{A}$ is a decision made by an agent in a given state $s \in \mathcal{S}$.

Upon receiving an action $a$ at a state $s$, the decision process continues by sampling a new state $s'$ from the state transition probability function $\mathcal{T}(s' | s, a)$.

For our purposes it is useful to further consider a set of *observations* $\mathcal{O}$, which are representations of states that an agent acts upon. The observation function $\mathbf{O} : \mathcal{S} \rightarrow \mathcal{O}$ maps states $s$ to observations $o$.

A policy $\pi : \mathbb{R}^{|\mathcal{O}|} \rightarrow \mathbb{R}^{|\mathcal{A}|}$ is a function that maps an observation $o$ to a real-valued vector, $\pi(o) \in \mathbb{R}^{|\mathcal{A}|}$.

An action function $\mathbf{I} : \mathbb{R}^{|\mathcal{A}|} \rightarrow \mathcal{A}$ is a function that maps the output of a policy to an action.

An agent is a function that maps a state $s$ to an action $a$ according to a policy $\pi$. That is, an agent is the combination of an observation function $\mathbf{O}$, a policy $\pi$, and an action function $a = \mathbf{I}(\pi(\mathbf{O}(s)))$.

After receiving an action $a$ at a state $s$, but before a new state $s'$ is sampled, a reward $r$ is given by a *reward function* $\mathbf{R} : \mathcal{S} \times \mathcal{A} \rightarrow \mathbb{R}$.

An *episode* is a sequence of states, actions, and rewards that an agent follows from a given initial state $s_0$ to a terminal state $s_T$.

A *trajectory* is a generalization of an episode as a sequence of states, actions, and rewards that begin with some state $s_t$ and end at some other state $s_{t+n}$. Note that trajectories do not need to begin with an initial state $s_0$, and do not need to end with a terminal state $s_T$. They can also be of infinite length.

A *return* $G$ is the sum of rewards obtained by an agent over a trajectory. In the undiscounted episodic setting, a return is defined by $G_t = \sum_{t=1}^{t=T} r_t$. However, in the more general setting there may be no terminal state $s_T$. 

As such, we typically consider *discounted returns* $G_t = \sum_{t=1}^{t=inf} \gamma^{t-1} r_t$, where $\gamma \in [0, 1)$ is the *discount factor*.

The discount factor $\gamma$ works to ensure that $G_t$ converges in the limit as $t \rightarrow \infty$. This is because $\sum_{t=0}^{\infty} \gamma^t$ is a converging geometric series, so if the maximum value of $|r_t|$ is finite, then $G_t$ is also finite. Further, $\gamma$ works as a form of *credit assignment*, where actions that are taken closer to time $t$ have a greater impact on the return $G_t$ (this is because $\gamma^t$ gets smaller as $t$ gets larger). Another way to think of this is that actions taken farther into the future are less important than the actions we just took.

The *state value function*, often just called the *value function* $V : \mathcal{S} \rightarrow \mathbb{R}$ is a function that maps states to the *expected return* of a policy at that state. It is defined by $V(s_t) = \mathbb{E}_{\pi}[G_t | s_t]$. This is an important quantity to understand because it captures the *quality* of a policy at a given state. It should be emphasized that the value function considers only one specific policy, so every time we make even a tiny change to our agent's policy, the value function will change as well. One way to envision the value function is to imagine the agent being dropped into the game at some arbitrary state $s$. The *value* of the policy at that state is the *expected return* that the agent will get if they play the game according to that policy forever, starting at that state and stopping if a terminal state is ever reached.

The *state-action value function*, or *Q function* $Q : \mathcal{S} \times \mathcal{A} \rightarrow \mathbb{R}$ is a function that maps states and actions to the *expected return* of a policy at a state $s$ when the agent takes action $a$ at that state, then acts according to $pi$ forever afterwards. It is defined by $Q(s_t, a_t) = \mathbb{E}_{\pi}[G_t | s_t, a_t]$. This quantity is similar to $V(s)$, but with the caveat that the agent must first take the action $a_t$ at state $s_t$ before acting according to the policy $\pi$ forever afterwards. Note that $Q(s, a)$ can be written in terms of $V(s)$ as $Q(s, a) = V(s) + r + \gamma V(s')$.

A third useful quantity is the *state-action advantage function*, or *advantage function* $A : \mathcal{S} \times \mathcal{A} \rightarrow \mathbb{R}$, is the difference between the Q function and the value function at a timestep. This is given by $A(s_t, a_t) = Q(s_t, a_t) - V(s_t)$. Think of the advantage function as a measure of how much better it was to take the action $a_t$ at state $s_t$ than it would have been to just act according to the policy $\pi$ at that state.

## How Agents Learn

Most learning algorithms consider an *objective function* $J(\pi)$, which is a function that maps a policy $\pi$ to a real number. The goal of learning is then to find a policy $\pi^*$ that maximizes the objective function, i.e. $J(\pi^*) = \max_{\pi} J(\pi)$. A convenient choice for $J$ would be any of the Q function, value function, or advantage function. For our purposes, we will focus on the advantage function, because the Proximal Policy Optimization (PPO) algorithm uses it as the objective.
