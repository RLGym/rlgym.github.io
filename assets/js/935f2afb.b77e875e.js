"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[53],{1109:e=>{e.exports=JSON.parse('{"pluginId":"default","version":"current","label":"Next","banner":null,"badge":false,"noIndex":false,"className":"docs-version-current","isLast":true,"docsSidebars":{"tutorialSidebar":[{"type":"category","label":"Getting Started","items":[{"type":"link","label":"Introduction","href":"/Getting Started/introduction","docId":"Getting Started/introduction"},{"type":"link","label":"Overview","href":"/Getting Started/overview","docId":"Getting Started/overview"},{"type":"link","label":"Quick Start Guide","href":"/Getting Started/quickstart","docId":"Getting Started/quickstart"}],"collapsed":true,"collapsible":true},{"type":"category","label":"Rocket League","items":[{"type":"link","label":"Training an Agent","href":"/Rocket League/training_an_agent","docId":"Rocket League/training_an_agent"},{"type":"category","label":"Configuration Objects","items":[{"type":"link","label":"Action Parsers","href":"/Rocket League/Configuration Objects/action_parsers","docId":"Rocket League/Configuration Objects/action_parsers"},{"type":"link","label":"Done Conditions","href":"/Rocket League/Configuration Objects/done_conditions","docId":"Rocket League/Configuration Objects/done_conditions"},{"type":"link","label":"Observation Builders","href":"/Rocket League/Configuration Objects/observation_builders","docId":"Rocket League/Configuration Objects/observation_builders"},{"type":"link","label":"Renderers","href":"/Rocket League/Configuration Objects/renderers","docId":"Rocket League/Configuration Objects/renderers"},{"type":"link","label":"Reward Functions","href":"/Rocket League/Configuration Objects/reward_functions","docId":"Rocket League/Configuration Objects/reward_functions"},{"type":"link","label":"State Mutators","href":"/Rocket League/Configuration Objects/state_mutators","docId":"Rocket League/Configuration Objects/state_mutators"}],"collapsed":true,"collapsible":true}],"collapsed":true,"collapsible":true},{"type":"category","label":"Custom Environments","items":[{"type":"link","label":"Creating an Environment","href":"/Custom Environments/custom-environment","docId":"Custom Environments/custom-environment"}],"collapsed":true,"collapsible":true},{"type":"category","label":"Cheatsheets","items":[{"type":"link","label":"List of Game Values","href":"/Cheatsheets/game_values","docId":"Cheatsheets/game_values"},{"type":"link","label":"Reinforcement Learning Background","href":"/Cheatsheets/reinforcement_learning_terms","docId":"Cheatsheets/reinforcement_learning_terms"}],"collapsed":true,"collapsible":true}]},"docs":{"Cheatsheets/game_values":{"id":"Cheatsheets/game_values","title":"List of Game Values","description":"This document provides a reference for constant values used in Rocket League. All spatial measurements are in Unreal Units (uu), where 1 uu = 1 centimeter.","sidebar":"tutorialSidebar"},"Cheatsheets/reinforcement_learning_terms":{"id":"Cheatsheets/reinforcement_learning_terms","title":"Reinforcement Learning Background","description":"What follows is a series of definitions that may be useful to understand the concepts of reinforcement learning that are used when training an agent in an RLGym environment. Note that these definitions are not meant to be exhaustive, and we will formulate the reinforcement learning setting in a somewhat non-standard way to better align with the environments typically considered by practitioners using RLGym.","sidebar":"tutorialSidebar"},"Custom Environments/custom-environment":{"id":"Custom Environments/custom-environment","title":"Creating an Environment","description":"This tutorial demonstrates how to implement a grid world environment using the RLGym API. Each RLGym environment requires implementing the configuration objects described in the RLGym overview. The following example illustrates an implementation of each required component.","sidebar":"tutorialSidebar"},"Getting Started/introduction":{"id":"Getting Started/introduction","title":"Introduction","description":"What is RLGym?","sidebar":"tutorialSidebar"},"Getting Started/overview":{"id":"Getting Started/overview","title":"Overview","description":"RLGym breaks down a reinforcement learning environment into a set of components, which we call \\"configuration objects.\\" Every environment is defined by a set of these objects, and the RLGym API handles the flow of information between them to present a consistent interface for an agent to interact with. To create a new environment, users just need to implement each of the configuration objects described below and pass them to the RLGym constructor.","sidebar":"tutorialSidebar"},"Getting Started/quickstart":{"id":"Getting Started/quickstart","title":"Quick Start Guide","description":"Let\'s get you started with RLGym by installing it with RocketSim and training a basic Rocket League agent using RLGym-PPO. We\'ll set up a training environment, configure a learner, and get training. We\'ll use default settings here, but you can adjust these later to tune how your agent learns.","sidebar":"tutorialSidebar"},"RLGym Learn/introduction":{"id":"RLGym Learn/introduction","title":"RLGym Learn","description":"This is an upcoming project that is not finished yet. It will be a generic framework for reinforcement learning algorithms that can be used with RLGym. When available, this webpage will be updated."},"RLGym Tools/introduction":{"id":"RLGym Tools/introduction","title":"RLGym Tools","description":"RLGym Tools is a collection auxiliary tools for RLGym that are useful for training and evaluating RL agents in Rocket League. These tools include a replay parser, an in-game scoreboard tracker, several reward functions and action parsers, much more. An exhaustive list of the tools won\'t be provided here, but we will highlight a few of them so you can get an idea of what is available."},"Rocket League/Configuration Objects/action_parsers":{"id":"Rocket League/Configuration Objects/action_parsers","title":"Action Parsers","description":"Action parsers are how your agent\'s decisions get turned into actual game inputs. They take whatever your policy outputs and convert it into the 8 controller inputs that RocketSim and Rocket League understand (things like throttle, steering, etc.). Check out our Game Values cheatsheet to see what these inputs are.","sidebar":"tutorialSidebar"},"Rocket League/Configuration Objects/done_conditions":{"id":"Rocket League/Configuration Objects/done_conditions","title":"Done Conditions","description":"A DoneCondition determines when an episode should end. In RLGym v2, a done condition can signal either a terminal state (natural episode end) or a truncated state (early termination). The RocketSim transition engine handles checking these conditions and setting the appropriate flags in the environment step.","sidebar":"tutorialSidebar"},"Rocket League/Configuration Objects/observation_builders":{"id":"Rocket League/Configuration Objects/observation_builders","title":"Observation Builders","description":"An ObsBuilder is an object used by RLGym to transform a GameState from the transition engine into inputs for each","sidebar":"tutorialSidebar"},"Rocket League/Configuration Objects/renderers":{"id":"Rocket League/Configuration Objects/renderers","title":"Renderers","description":"RLGym v2 provides a way to visualize the game state during training or evaluation through the Renderer interface. The renderer is responsible for displaying the current state of the game, including car positions, ball position, boost pads, and other game elements.","sidebar":"tutorialSidebar"},"Rocket League/Configuration Objects/reward_functions":{"id":"Rocket League/Configuration Objects/reward_functions","title":"Reward Functions","description":"A RewardFunction is an object used by an RLGym environment to compute the rewards for each agent every step.","sidebar":"tutorialSidebar"},"Rocket League/Configuration Objects/state_mutators":{"id":"Rocket League/Configuration Objects/state_mutators","title":"State Mutators","description":"Before anything happens in the environment, there must be an initial state. RLGym v2 provides a way for users to construct and modify this state via StateMutator objects. Multiple StateMutator objects can be combined using MutatorSequence, which applies them sequentially to modify the current state.","sidebar":"tutorialSidebar"},"Rocket League/training_an_agent":{"id":"Rocket League/training_an_agent","title":"Training an Agent","description":"This guide builds on our Quick Start Guide to help you train a more sophisticated Rocket League bot than the simple setup in the quickstart guide. We\'ll use RocketSim to run training much faster than the actual game, and cover all the key concepts you need to know.","sidebar":"tutorialSidebar"}}}')}}]);