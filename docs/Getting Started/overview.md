---
title: Overview
sidebar_position: 2
---

# Overview of RLGym

RLGym is designed to make creating and modifying reinforcement learning environments as simple as possible. The RLGym API breaks down an environment into several components, which we refer to as "configuration objects". All a user needs to do to create their own environment is write a concrete implementation of the configuration objects they want to use, and RLGym will handle the rest. Our goal is to provide a clear path from asking the question "Is it possible to use reinforcement learning with this game?" to actually training an agent.

## Configuration Objects

Every RLGym environment is built from the following components, which we refer to as "configuration objects":
- A `TransitionEngine`: Manages state transitions and core environment logic
- A `StateMutator`: Controls how environment state is modified (e.g., on reset)
- An `ObsBuilder`: Converts environment state into agent observations
- An `ActionParser`: Defines and validates agent actions
- A `RewardFunction`: Calculates rewards for agent actions
- One or more `DoneConditions`: Determine when episodes end (termination) or are cut short (truncation)
- Optionally a `Renderer`: Visualizes the environment state

The diagram below depicts how RLGym configuration objects come together to define an environment and interface with
a learning agent.

```mermaid
%%{
  init: {
    'theme': 'base',
    'themeVariables': {
      'primaryColor': '#6f48c0',
      'primaryTextColor': '#fff',
      'primaryBorderColor': '#5d2c84',
      'lineColor': '#808080',
      'secondaryColor': '#8d8d8d',
      'tertiaryColor': '#fff'
    },
    'flowchart': { 'curve': 'bump' }
  }
}%%
flowchart TB
    A[StateMutators] -->|Initial State| B[Transition Engine]
    B -->|Game State| C[Renderer]
    B --> D{{Agents, Next State, Shared Info}}
    D --> E[ObsBuilder]
    D --> F[RewardFunction]
    D --> G[TerminalConditions]
    D --> H[TruncationConditions]
    E -->|Observation| I[Learning Agent] 
    F -->|Reward| I
    G -->|Terminated| I
    H -->|Truncated| I
    I -->|Action| J[ActionParser]
    J -->|Engine Controls| B
```

To see an example of a concrete implementation of these configuration objects, see our [Custom Environment](../../Custom%20Environments/custom-environment) guide, or check out the individual examples relevant to Rocket League in our [Rocket League](../../Rocket%20League/Configuration%20Objects/action_parsers) section.