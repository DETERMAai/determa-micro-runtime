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
  +--> VALIDATION_DENIED --> LOOP_CONTINUE
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
FAILURE_CONVERGENCE
  |
  v
TASK_HALTED
  |
  v
ESCALATION_REQUIRED
```

## Operational Semantics

- `VALIDATION_DENIED` returns directly to loop continue and never reaches atomic apply.
- `EXECUTION_DENIED` triggers rollback containment.
- `TASK_HALTED` occurs after failure convergence threshold on repeated local failures.
- `ESCALATION_REQUIRED` is a boundary signal after local containment is exhausted.
