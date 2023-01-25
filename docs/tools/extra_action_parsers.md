---
title: Extra Action Parsers
---

## Extra Action Parsers

`rlgym-tools` comes with action parsers which are not packaged directly with RLGym. Here we will provide a brief summary of each parser and how to use it.


### KBMAction

A Keyboard and Mouse action parser that combines several actions, expecting 5 inputs rather
than the usual 8.

* throttle/pitch
* steer/pitch/roll
* jump
* boost
* handbrake/air roll

Be aware that this also inherits from `DiscreteAction`, meaning the resulting values will only be `-1, 0, 1`

```python
import rlgym
from rlgym_tools.extra_action_parsers.kbm_act import KBMAction

action_parser = KBMAction()

env = rlgym.make(action_parser=action_parser)
```
