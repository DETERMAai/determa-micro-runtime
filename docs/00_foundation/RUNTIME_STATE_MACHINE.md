# Runtime State Machine

DETERMA executes a bounded mutation state machine. The runtime is deterministic at the control-flow level: each step must pass before the next step is allowed.

## Canonical Flow

```text
TASK_START
  |
  v
MUTATION_REQUESTED
  |
  v
VALIDATION_GATES
  |
  v
VALIDATION_DENIED
  |
  v
ATOMIC_APPLY
  |
  v
TEST_EXECUTION
  |
  v
EXECUTION_DENIED
  |
  v
ROLLBACK_APPLIED
  |
  v
TASK_HALTED
  |
  v
ESCALATION_REQUIRED
```

## Operational Semantics

- `VALIDATION_DENIED` is a deny branch before atomic apply.
- `EXECUTION_DENIED` triggers rollback containment.
- `TASK_HALTED` occurs after convergence threshold on repeated local failures.
- `ESCALATION_REQUIRED` is a boundary signal after local containment is exhausted.

