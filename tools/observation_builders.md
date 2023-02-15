# Extra Observation Builders

`rlgym-tools` provides a number of community-made observation builders that are commonly used.

## GeneralStacker

This will stack the observations from an existing `ObsBuilder` over time into one long observation.
To use it, we simply give it an `ObsBuilder` to stack and tell it how many steps we would like it to stack for.

```python
import rlgym
from rlgym_tools.extra_obs import GeneralStacker
from rlgym.utils.obs_builders import AdvancedObs

obs_builder = AdvancedObs()

# Stack the observations from AdvancedObs over 5 steps.
obs_stacker = GeneralStacker(obs_builder, stack_size=5) 

env = rlgym.make(obs_builder=obs_stacker)
```

## AdvancedStacker

This is similar to the `AdvancedObs` object that comes with RLGym, with the inclusion of every action taken over the previous `stack_size` steps.

Example:

```python
import rlgym
from rlgym_tools.extra_obs import AdvancedStacker

obs_builder = AdvancedStacker(stack_size=5)

env = rlgym.make(obs_builder=obs_builder)
```
