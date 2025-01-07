---
title: Introduction
sidebar_position: 1
---

# Introduction

## What is RLGym?

RLGym is a Python API for creating reinforcement learning environments. While it was originally designed for the game [Rocket League](https://www.rocketleague.com), the core API is now game-agnostic. This means you can use RLGym to create environments from simple grid worlds to complex physics simulations. Check out the [overview](/Getting%20Started/overview) section for a detailed overview of the RLGym API.

## Getting Started

RLGym provides an implementation for Rocket League that uses [RocketSim](https://github.com/ZealanL/rocketsim) as a headless simulator. You can use the default settings or customize the environment by implementing your own [configuration objects](/Getting%20Started/overview/). Take a look at the [Quickstart Guide](quickstart.md) to train your first Rocket League agent, or check out the [Custom Environments](../../Custom%20Environments/custom-environment) section to see an example of how to create your own environment.

## Installation
RLGym is split into sub-packages to keep things simple. The core API has no dependencies, and you can add extra features through these sub-packages:

```bash
# Installs only the api
pip install rlgym  

# Installs all rocket league packages
pip install rlgym[rl]  

# Installs only RocketSim rocket league packages
pip install rlgym[rl-sim]  

# Installs RLViser and RocketSim rocket league packages
pip install rlgym[rl-rlviser]  

# Installs every rlgym component
pip install rlgym[all] 
```
