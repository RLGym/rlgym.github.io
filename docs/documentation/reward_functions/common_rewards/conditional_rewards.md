# Conditional rewards

Conditional rewards are rewards issued when a condition is met.

## [Custom Conditional Reward Classes](https://github.com/lucas-emery/rocket-league-gym/blob/7f07bfa980b84eea11627939dd7d7b1689efcfa7/rlgym/utils/reward_functions/common_rewards/conditional_rewards.py#L10)

Conditional rewards require that you provide a reward function, and a condition. If the condition is met, the reward function will be called and reward dealt to the model. Otherwise no reward will be provided.

```python
class ConditionalRewardFunction(RewardFunction):
    def __init__(self, reward_func: RewardFunction):
        super().__init__()
        self.reward_func = reward_func

    def condition(self, player: PlayerData, state: GameState, previous_action: np.ndarray) -> bool:

    def reset(self, initial_state: GameState):

    def get_reward(self, player: PlayerData, state: GameState, previous_action: np.ndarray) -> float:

    def get_final_reward(self, player: PlayerData, state: GameState, previous_action: np.ndarray) -> float:

```

## [Reward If Closest To Ball](https://github.com/lucas-emery/rocket-league-gym/blob/7f07bfa980b84eea11627939dd7d7b1689efcfa7/rlgym/utils/reward_functions/common_rewards/conditional_rewards.py#L33)

Return `True` if the current player is the closest player to the ball

```python
RewardIfClosestToBall(reward_func: RewardFunction, team_only=True)
```

```python
from rlgym.utils.reward_functions.conditional_rewards import RewardIfClosestToBall

reward_if_closest = RewardIfClosestToBall(reward_func)
```

## [Reward If Touched Last](https://github.com/lucas-emery/rocket-league-gym/blob/7f07bfa980b84eea11627939dd7d7b1689efcfa7/rlgym/utils/reward_functions/common_rewards/conditional_rewards.py#L48)

```python
RewardIfTouchedLast()
```

```python
from rlgym.utils.reward_functions.conditional_rewards import RewardIfTouchedLast

reward_if_touched_last = RewardIfTouchedLast()
```

## [Reward If Behind Ball](https://github.com/lucas-emery/rocket-league-gym/blob/7f07bfa980b84eea11627939dd7d7b1689efcfa7/rlgym/utils/reward_functions/common_rewards/conditional_rewards.py#L53)

```python
RewardIfBehindBall()
```

```python
from rlgym.utils.reward_functions.conditional_rewards import RewardIfBehindBall

reward_if_behind_ball = RewardIfBehindBall()
```
