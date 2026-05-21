# DETERMA Micro Runtime

Deterministic execution runtime for weak local autonomous coding models.

## Overview

DETERMA Micro Runtime is a small containment runtime for code mutation tasks.  
It runs a fixed loop with explicit validation, bounded prompts, rollback, replay denial, and append-only execution journaling.

## Why Local Models Fail

Weak local models commonly fail in repeatable ways:

- repeated invalid patches
- stochastic retries that loop on the same failure shape
- oversized prompts that reduce output quality
- non-atomic writes that leave partial file state

Without runtime containment, these failure modes produce unstable execution.

## What DETERMA Does

DETERMA enforces deterministic runtime controls:

- scope validation before mutation
- prompt budget validation before generation
- one-mutation-per-step execution
- atomic apply via temporary file + rename
- test-gated commit with rollback on failure
- replay denial for known failed mutation hashes
- target-level failure convergence halt after repeated failures
- append-only journal status output

DETERMA = deterministic execution containment runtime.

## Runtime Architecture

The runtime is intentionally small and file-oriented.

```
repo/
|-- runtime/
|   |-- runtime_gateway.ts
|   |-- replay_guard.ts
|   |-- rollback.ts
|   `-- journal.ts
|-- model/
|   |-- local_model.ts
|   `-- prompt_builder.ts
|-- loop/
|   `-- mutation_loop.ts
`-- examples/
    `-- auth_bug/
        |-- auth.py
        `-- test_auth.py
```

### Repository Structure

- `runtime/`: enforcement primitives
- `model/`: bounded prompt + single local model request
- `loop/`: deterministic mutation executor
- `examples/auth_bug/`: reproducible bug target and test
- `journal/`: append-only execution logs

## Deterministic Mutation Loop

Minimal runtime flow:

```
read file
  |
  v
build tiny prompt
  |
  v
request ONE mutation
  |
  v
validate mutation
  |
  v
apply atomically
  |
  v
run pytest
  |
  v
rollback or commit
  |
  v
journal execution state
```

Execution boundary checks in-loop:

```
prompt length <= 4000
scope path does not contain ".."
replay hash not previously failed
target failure count < 3
```

## Runtime Components

- `runtime_gateway.ts`: `validateScope`, `validateExecutionBudget`
- `replay_guard.ts`: in-memory replay denial (`seenFailure`, `recordFailure`)
- `failure_convergence.ts`: in-memory target halt (`recordTargetFailure`, `shouldHalt`)
- `rollback.ts`: backup and restore via filesystem copy
- `journal.ts`: append-only JSONL mutation journal
- `prompt_builder.ts`: fixed tiny prompt
- `local_model.ts`: one Ollama generate call, no retries
- `mutation_loop.ts`: deterministic executor with entrypoint

## Operational Proof

Expected runtime outcomes:

- `EXECUTION_DENIED`: mutation applied, tests failed, rollback restored previous file state
- `TASK_HALTED`: target reached convergence threshold (3 failures), loop stopped
- replay denial: identical failed mutation hash denied on future attempts

Example invariant set:

- failed mutation never remains committed after pytest failure
- repeated failed mutation hash is denied
- repeated target failure converges to halt

## Running the Runtime

1. Start Ollama locally and ensure model availability (`qwen2.5-coder:7b`).
2. From repository root, run:

```bash
npx tsx loop/mutation_loop.ts
```

Runtime uses:

- target file: `examples/auth_bug/auth.py`
- test command: `pytest -q` in `examples/auth_bug/`
- journal path: `journal/mutations.log`

## Example Journal Output

```json
{"timestamp":"2026-05-21T00:00:00.000Z","mutationHash":"f3b8...","status":"EXECUTION_DENIED"}
{"timestamp":"2026-05-21T00:00:02.000Z","mutationHash":"f3b8...","status":"REPLAY_DENIED"}
{"timestamp":"2026-05-21T00:00:04.000Z","mutationHash":"C:\\repo\\examples\\auth_bug\\auth.py","status":"TASK_HALTED"}
```

## Design Principles

- deterministic runtime over model autonomy
- hard bounds over adaptive behavior
- atomic mutation semantics
- explicit denial states over implicit retries
- small surface area over extensible architecture

## MVP Scope

Included:

- single-file mutation target
- in-memory replay guard
- in-memory convergence halt
- local Ollama call
- test-gated commit/rollback
- append-only journal

Not included:

- orchestration layers
- plugins
- distributed state
- external databases
- framework abstractions

## Runtime Comparison

Ratings below measure execution containment quality, not reasoning intelligence or coding benchmark capability.

| System | Execution Stability | Cost Efficiency | Determinism | Containment | Cheap Local Models |
| --- | ---: | ---: | ---: | ---: | ---: |
| DETERMA + Ollama | 9 | 10 | 10 | 10 | 10 |
| OpenHands | 6 | 5 | 4 | 5 | 5 |
| CrewAI | 5 | 6 | 3 | 4 | 6 |
| LangGraph Agents | 6 | 6 | 5 | 5 | 6 |
| AutoGen | 5 | 5 | 3 | 4 | 5 |
| Cursor Agent | 6 | 4 | 4 | 5 | 3 |
| Claude Code | 7 | 3 | 6 | 6 | 2 |
| Devin-style systems | 6 | 2 | 5 | 5 | 1 |

DETERMA optimizes for bounded execution, rollback containment, convergence halt semantics, deterministic runtime governance, and cheap local autonomous execution.

Existing agent systems are primarily optimized for reasoning capability, orchestration, long-context autonomy, tool recursion, and planning complexity.

## What DETERMA Measures

- rollback recovery rate
- retry collapse prevention
- escalation efficiency
- execution stability economics
- bounded execution behavior

## What DETERMA Does NOT Optimize For

- large-scale planning
- multi-agent orchestration
- long-context reasoning
- autonomous repo-wide refactors

## License

MIT. See [LICENSE](LICENSE).
