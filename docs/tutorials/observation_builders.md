## Observation Builders
An `ObsBuilder` is an object used by RLGym to transform the game state into an input for the agent at every step. Observation builders are used similarly to [Reward Functions](https://rlgym.github.io/docs-page.html#reward-functions)
by the environment. At each step, the observation builder will be called once per player with the current game state. The output of the observation builder will be returned as the `obs` from `env.step`.

Observation builders need to implement two methods
```python
#Called once per reset.
reset(self, initial_state: GameState)

#Called once per step and reset.
build_obs(self, player: PlayerData, state: GameState, previous_action: np.ndarray) -> Any
```

