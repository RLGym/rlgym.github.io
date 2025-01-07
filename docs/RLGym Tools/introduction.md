---
title: RLGym Tools
---

# RLGym Tools

RLGym Tools is a collection of extra reward functions and environment wrappers that can be used with RLGym. An exhaustive list of the tools is beyond the scope of this article, but here are some highlights:

## Replay Parser
The replay parser provides a convenient way to parse a replay file into a sequence of RLGym `GameState` objects. Here's an example:
```python
from rlgym_tools.rocket_league.replays.parsed_replay import ParsedReplay
from rlgym_tools.rocket_league.replays.convert import replay_to_rlgym

# Load a replay
replay = ParsedReplay.load("my_replay.replay")

# Convert the replay to a sequence of ReplayFrames.
replay_frames = replay_to_rlgym(replay)

# Now we can iterate over the replay frames.
for replay_frame in replay_frames:
    # ReplayFrame:
    #     state: GameState
    #     actions: Dict[int, np.ndarray]
    #     update_age: Dict[int, float]
    #     scoreboard: ScoreboardInfo
    #     episode_seconds_remaining: float
    #     next_scoring_team: Optional[int]
    #     winning_team: Optional[int]

```

## Scoreboard
One might be interested in training agents only in complete Rocket League games. This requires keeping track of the scores for each team over the course of a game, and the time left on the clock. RLGym Tools provides a simple way to do this through the `ScoreboardProvider`, which is a `SharedInfoProvider` that provides a scoreboard for the game inside the `shared_info` dict. We'll combine that with a state mutator that will set the initial values in the scoreboard each time the environment is reset, and a done condition that will terminate an episode when a standard Rocket League game has been concluded.



The scoreboard is a `SharedInfoProvider` that provides a scoreboard for the game. This allows you to keep track of the scores of each team in a game. All you need to do is create an instance of the `ScoreboardProvider` and pass it to the `RLGym` environment. We'll also pass in a mutator to set the initial values in the scoreboard each time the environment is reset, like so:

```python
from rlgym.api import RLGym

from rlgym_tools.rocket_league.state_mutators.game_mutator import GameMutator
from rlgym_tools.rocket_league.shared_info_providers.scoreboard_provider import ScoreboardProvider
from rlgym_tools.rocket_league.done_conditions.game_condition import GameCondition

env = RLGym(
    state_mutator=GameMutator(),
    shared_info_provider=ScoreboardProvider(),
    termination_cond=GameCondition(),
    ...
)
```
Now you can access the scoreboard from the `shared_info` dict anywhere it is available (e.g. from inside an `ObsBuilder` or `RewardFunction` object) as `scoreboard = shared_info["scoreboard"]`, and episodes will be terminated when a standard Rocket League game has been completed (e.g. a team has a majority of goals after 5 minutes of in-game time have passed).

Many more useful tools like these are available for you to use. Check them out at the [RLGym Tools repository](https://github.com/rlgym/rlgym-tools).