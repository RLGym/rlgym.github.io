---
title: Introduction
sidebar_position: 1
---

# Introduction

## What is RLGym?

RLGym is a Python API for creating reinforcement learning environments. While it was originally designed for the game [Rocket League](https://www.rocketleague.com), the core API is now game-agnostic. This means you can use RLGym to create any kind of environment you want, from simple grid worlds to complex physics simulations. Get an overview of the API in our [overview](/Getting%20Started/overview) section.

## How it Works
RLGym provides a simple API for creating fully customizable environments for reinforcement learning projects. Each environment is built from a few core components, which we refer to as "configuration objects". When provided with a set of configuration objects, RLGym will handle the flow of information throughout the environment, and provide a simple interface for learning agents to interact with.

## Getting Started

The most developed use of RLGym is for Rocket League. We provide a complete environment implementation that allows users to train agents with [RocketSim](https://github.com/ZealanL/rocketsim), a headless simulator for Rocket League. Users can customize every aspect of the environment by implementing their own [Configuration Objects](/Getting%20Started/overview/), or use the default implementations provided by RLGym. Head over to our [Quickstart Guide](quickstart.md) if you want to jump right in to training a Rocket League agent, or check out our [Custom Environments](../../Custom%20Environments/custom-environment) section for a step-by-step guide to creating your own environment with the RLGym API.

## Installation
RLGym is split into several packages to keep things modular and lightweight. The core API package has no dependencies, while additional packages provide specific functionality:

```bash
# Installs every rlgym component
pip install rlgym[all]  

# Installs only the api
pip install rlgym  

# Installs all rocket league packages
pip install rlgym[rl]  

# Installs only RocketSim rocket league packages
pip install rlgym[rl-sim]  

# Installs RLViser and RocketSim rocket league packages
pip install rlgym[rl-rlviser]  
```
