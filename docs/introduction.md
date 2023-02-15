---
title: Introduction
sidebar_position: 1
---

# What is RLGym?

The Rocket League Gym is a [Python](https://www.python.org/) API that can be used to treat the game [Rocket League](https://www.rocketleague.com) as though it were an [OpenAI Gym](https://gym.openai.com)-style environment for [Reinforcement Learning](https://en.wikipedia.org/wiki/Reinforcement_learning) projects.

## How it Works

RLGym communicates with a [Bakkesmod](https://www.bakkesmod.com/) plugin to control the game while it is running.
This enables the Python API to manipulate the game just like a standard Gym environment, with familiar functions like `make()`, `reset()` and `step()`.
Bakkesmod also enables RLGym to control the rate at which the physics engine updates while the game is running, so matches inside the game can be run much faster than real-time.

## Requirements

* A Windows 10 PC
* [Rocket League](https://www.rocketleague.com) (Both Steam and Epic are supported)
* [Bakkesmod](https://www.bakkesmod.com)
* The RLGym plugin for Bakkesmod (Installed automatically if downloading via pip)
* Python between versions 3.7 and 3.9 (3.10 not supported).

## Installation

If you are interested in playing against Nexto or other bots, please visit [RLBot](https://rlbot.org/).

If you are interested in training your own bots with RLGym, simply install via pip:

```python
pip install rlgym
```

To enable the RLGym plugin, start by opening Rocket League.
From inside the game, press F2 to open the Bakkesmod menu and navigate to the plugins tab.
From there open the Plugin Manager and scroll down to the RLGym plugin.
Check the box to enable the plugin and close the game.
