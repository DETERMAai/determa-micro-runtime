# Rollback Containment Proof

## Objective

Prove rollback containment behavior on execution-denied paths.

## Runtime Mechanism

- `EXECUTION_DENIED` branch executes:
  - `restoreFile(...)`
  - `ROLLBACK_APPLIED` metric event
- This path is implemented in `loop/mutation_loop.ts`.

## Observed Proof Runner Output

Current deterministic proof run:

```text
[DETERMA] PROOF START
[DETERMA] MUTATION REQUESTED
[DETERMA] VALIDATION_DENIED
[DETERMA] PROOF VALIDATION_DENIED
[DETERMA] MUTATION REQUESTED
[DETERMA] VALIDATION_DENIED
[DETERMA] MUTATION REQUESTED
[DETERMA] VALIDATION_DENIED
[DETERMA] TASK_HALTED
```

In this run, validation denial prevented test execution, so rollback was not entered.

## Containment Interpretation

- Pre-apply validation containment worked first (`VALIDATION_DENIED`).
- Rollback containment remains the deterministic downstream deny mechanism for post-apply test failure paths.
