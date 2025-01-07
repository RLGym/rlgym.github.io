---
title: RLGym Tools
---

# RLGym Tools

[RLGym Tools](https://github.com/rlgym/rlgym-tools) is a collection auxiliary tools for RLGym that are useful for training and evaluating RL agents in Rocket League. These tools include a replay parser, an in-game scoreboard tracker, several reward functions and action parsers, much more. An exhaustive list of the tools won't be provided here, but we will highlight a few of them so you can get an idea of what is available. 

## Replay Parser
The replay parser converts Rocket League replay files into sequences of RLGym `GameState` objects for replay analysis and imitation learning. 

Here is a simple example:
```python
from rlgym_tools.rocket_league.replays.parsed_replay import ParsedReplay
from rlgym_tools.rocket_league.replays.convert import replay_to_rlgym

# Parse replay file
replay = ParsedReplay.load("my_replay.replay")

# Convert to ReplayFrame sequence
replay_frames = replay_to_rlgym(replay)

# Now we can iterate over the replay frames.
for replay_frame in replay_frames:
    # ReplayFrame structure:
    #     state: GameState                 # Game state representation
    #     actions: Dict[int, np.ndarray]   # Player action vectors
    #     update_age: Dict[int, float]     # Time delta since last update
    #     scoreboard: ScoreboardInfo       # Game score state
    #     episode_seconds_remaining: float  # Match time remaining
    #     next_scoring_team: Optional[int] # Team scoring next goal
    #     winning_team: Optional[int]      # Currently leading team
```

## Scoreboard
The `ScoreboardProvider` facilitates training in complete Rocket League matches by tracking the in-game scoreboard through the `shared_info` interface. The scoreboard can be integrated with the `GameMutator` and `GameCondition` objects from RLGym Tools to enforce standard Rocket League match termination rules.

Implementation example:
```python
from rlgym.api import RLGym
from rlgym_tools.rocket_league.state_mutators.game_mutator import GameMutator
from rlgym_tools.rocket_league.shared_info_providers.scoreboard_provider import ScoreboardProvider
from rlgym_tools.rocket_league.done_conditions.game_condition import GameCondition

# Configure an environment to behave like a standard Rocket League match
env = RLGym(
    state_mutator=GameMutator(),
    shared_info_provider=ScoreboardProvider(),
    termination_cond=GameCondition(),
    ...
)
```

The scoreboard is accessible via `shared_info["scoreboard"]` within anything that has access to `shared_info` (e.g. any of the RLGym configuration objects). Episodes in this environment will terminate according to standard Rocket League rules, including going into overtime after 5 minutes until a team scores if the score is tied.

To see all of the tools and components available in RLGym Tools, visit the [RLGym Tools repository](https://github.com/rlgym/rlgym-tools).