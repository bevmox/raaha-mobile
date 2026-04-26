# Physics — gesture tunables

All constants live in [`src/lib/physics.ts`](src/lib/physics.ts). This file
documents what each one does and how it feels if you nudge it. When you tune
on Saturday, change values there, not in components.

## Commit thresholds — horizontal (left / right)

| Constant | Value | Units | Controls | Tune this if… |
|---|---|---|---|---|
| `HORIZONTAL_DISTANCE_THRESHOLD` | `0.3` | fraction of `window.innerWidth` | % of screen the card must travel to commit L/R | Swipe feels sticky (lower to `0.25`) or commits by accident on a tap-drag (raise to `0.35`) |
| `HORIZONTAL_VELOCITY_THRESHOLD` | `500` | px/s | Flick speed that commits regardless of distance | Flicks feel unresponsive (lower to `400`); stray gestures fire commits (raise to `600`) |

## Commit thresholds — vertical (up = skip)

Stricter than horizontal by design — up is a deliberate action.

| Constant | Value | Units | Controls | Tune this if… |
|---|---|---|---|---|
| `VERTICAL_DISTANCE_THRESHOLD` | `0.4` | fraction of `window.innerHeight` | % of screen the card must travel up to skip | Skip feels impossible to trigger (lower to `0.3`); accidental vertical drift skips (raise to `0.5`) |
| `VERTICAL_VELOCITY_THRESHOLD` | `700` | px/s | Upward flick speed that commits skip | Skip flicks feel unresponsive (lower to `550`); fast vertical reads misfire skips (raise to `850`) |

## Rotation during drag

| Constant | Value | Units | Controls | Tune this if… |
|---|---|---|---|---|
| `MAX_ROTATION_DEG` | `6` | degrees | Peak tilt at the screen edge | Card feels stiff and boring (raise to `8`); feels dating-app playful (lower to `4`) — never exceed `10`, that's Tinder territory |
| `ROTATION_RANGE_PX` | `195` | px from center | Distance at which rotation peaks | Rotation saturates too early on small phones (raise toward `240`); rotation never feels noticeable on large phones (lower toward `160`) |

## Exit animation — after commit

| Constant | Value | Units | Controls | Tune this if… |
|---|---|---|---|---|
| `EXIT_DURATION_HORIZONTAL_S` | `0.3` | seconds | Time for a committed L/R card to fly off | Exit feels laggy (lower to `0.25`); feels abrupt / pops (raise to `0.35`) |
| `EXIT_DURATION_VERTICAL_S` | `0.35` | seconds | Time for a committed up-skip card to fly off | Skip feels identical to L/R (raise to `0.4` for more deliberate "lift off"); feels sluggish (lower to `0.3`) |
| `EXIT_DISTANCE_MULTIPLIER` | `1.25` | × viewport dimension | How far off-screen the card travels | Card leaves a visible sliver (raise to `1.4`); exit distance wastes perceived time (lower toward `1.1`) |

## Spring-back — non-commit release

Framer Motion spring. Higher stiffness = snappier. Higher damping = less bounce.

| Constant | Value | Controls | Tune this if… |
|---|---|---|---|
| `SPRING_STIFFNESS` | `400` | Snap speed on release | Return feels floaty (raise to `500`); feels rigid / jittery (lower to `320`) |
| `SPRING_DAMPING` | `30` | Overshoot / bounce | Card wobbles past center (raise to `35`); return feels inert (lower to `24`) |

## Axis lock

| Constant | Value | Units | Controls | Tune this if… |
|---|---|---|---|---|
| `AXIS_LOCK_THRESHOLD_PX` | `10` | px | Dominant-axis travel before drag locks to that axis | Diagonal drags feel confused (lower to `6`); one-axis intent feels misread (raise to `14`) |

Note: Framer Motion's `dragDirectionLock` enforces this threshold internally.
The constant documents the contract; the runtime is Framer's default.

## Stack layering

| Constant | Value | Units | Controls | Tune this if… |
|---|---|---|---|---|
| `PEEK_SCALE` | `0.95` | scale factor | Size of the card peeking under the top card | Peek card too visible / competes (lower to `0.92`); peek feels missing (raise to `0.97`) |
| `PEEK_Y_OFFSET_PX` | `8` | px | How far below the top card the peek sits | Peek invisible (raise to `12`); peek too separated, feels like a second card (lower to `4`) |
| `STACK_PROMOTE_DURATION_S` | `0.3` | seconds | Time for peek to promote to top after a commit | Promotion feels unrelated to exit (match `EXIT_DURATION_HORIZONTAL_S`); feels labored (lower to `0.25`) |

## Terminal state

| Constant | Value | Units | Controls | Tune this if… |
|---|---|---|---|---|
| `TERMINAL_PAUSE_MS` | `800` | ms | Dead time after the last card exits before "Thinking…" appears | Transition feels rushed (raise to `1000`); feels dead (lower to `600`) |
| `TERMINAL_PROPOSAL_DELAY_MS` | `1500` | ms | Time "Thinking…" holds before the proposal reveals | Proposal should land sooner (lower to `800`); "Thinking…" should actually feel like thinking (raise to `2000`) |

## Reduced motion

When `prefers-reduced-motion: reduce` is set at the OS level, rotation is
zeroed and exits shorten. Drag translation itself stays 1:1 — the user's
finger isn't an animation, it's input.

| Constant | Value | Units | Controls |
|---|---|---|---|
| `REDUCED_MOTION_EXIT_DURATION_S` | `0.15` | seconds | Exit tween duration in reduced-motion |
| `REDUCED_MOTION_ROTATION_DEG` | `0` | degrees | Rotation range in reduced-motion (disables tilt) |
