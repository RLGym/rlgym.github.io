---
title: List of Game Values
sidebar_position: 2
---

# Game Values

All lengths are measured in Unreal Units (uu), equivalent to 1 centimeter.

## Field Dimensions
| Name | Type | Range | Description |
|------|------|-------|-------------|
| `SIDE_WALL_X` | float | ±4096 | Distance from center to side wall |
| `BACK_WALL_Y` | float | ±5120 | Distance from center to back wall |
| `CEILING_Z` | float | 2044 | Height of the ceiling |
| `BACK_NET_Y` | float | ±6000 | Distance from center to back of net |
| `CORNER_CATHETUS_LENGTH` | float | 1152 | Length of corner wall section |
| `RAMP_HEIGHT` | float | 256 | Height of corner ramp |

## Goal Dimensions
| Name | Type | Range | Description |
|------|------|-------|-------------|
| `GOAL_HEIGHT` | float | 642.775 | Height of goal opening |
| `GOAL_CENTER_TO_POST` | float | 892.755 | Width from center to goal post |

## Time Values
| Name | Type | Range | Description |
|------|------|-------|-------------|
| `TICKS_PER_SECOND` | int | 120 | Physics updates per second |
| `SMALL_PAD_RECHARGE` | float | 4.0 | Small boost pad respawn time |
| `BIG_PAD_RECHARGE` | float | 10.0 | Large boost pad respawn time |
| `DEMO_RESPAWN_SECONDS` | float | 3.0 | Time to respawn after demo |
| `BOOST_CONSUMPTION_RATE` | float | 33.3 | Boost used per second |

## Physics Values
| Name | Type | Range | Description |
|------|------|-------|-------------|
| `BOOST_ACCELERATION` | float | 991.666 | Acceleration from boost |
| `GRAVITY` | float | 650 | Downward acceleration |
| `BALL_RADIUS` | float | 91.25 | Radius of the ball |
| `CAR_MASS` | float | 180 | Mass of car (arbitrary units) |
| `BALL_MASS` | float | 30 | Mass of ball (arbitrary units) |

## Speed Limits
| Name | Type | Range | Description |
|------|------|-------|-------------|
| `BALL_MAX_SPEED` | float | 6000 | Maximum ball speed |
| `CAR_MAX_SPEED` | float | 2300 | Maximum car speed |
| `SUPERSONIC_THRESHOLD` | float | 2200 | Speed for supersonic trail |
| `CAR_MAX_ANG_VEL` | float | 5.5 | Max angular velocity (rad/s) |

## Teams
| Name | Type | Range | Description |
|------|------|-------|-------------|
| `BLUE_TEAM` | int | 0 | Blue team identifier |
| `ORANGE_TEAM` | int | 1 | Orange team identifier |

## Car Types
| Name | Type | Range | Description |
|------|------|-------|-------------|
| `OCTANE` | int | 0 | Octane hitbox type |
| `DOMINUS` | int | 1 | Dominus hitbox type |
| `PLANK` | int | 2 | Plank hitbox type |
| `BREAKOUT` | int | 3 | Breakout hitbox type |
| `HYBRID` | int | 4 | Hybrid hitbox type |
| `MERC` | int | 5 | Merc hitbox type |

## Car Controls
| Input      | Range      | Type          |
|:-----------|:-----------|:--------------|
| Throttle   | `[-1, 1]`  | `Continuous`  |
| Steer      | `[-1, 1]`  | `Continuous`  |
| Yaw        | `[-1, 1]`  | `Continuous`  |
| Pitch      | `[-1, 1]`  | `Continuous`  |
| Roll       | `[-1, 1]`  | `Continuous`  |
| Jump       | `{0, 1}`   | `Discrete`    |
| Boost      | `{0, 1}`   | `Discrete`    |
| Handbrake  | `{0, 1}`   | `Discrete`    |

## Jump Physics
| Name | Type | Range | Description |
|------|------|-------|-------------|
| `DOUBLEJUMP_MAX_DELAY` | float | 1.25 | Max time between jumps |
| `FLIP_TORQUE_TIME` | float | 0.65 | Duration of flip torque |
