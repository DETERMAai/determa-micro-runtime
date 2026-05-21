# Escalation Boundary Proof

## Objective

Prove that escalation is signaled only after local convergence halt and failure threshold conditions are met.

## Method

- Trigger local halt first (`TASK_HALTED`).
- Execute escalation boundary via task runner.
- Runner: `npx tsx factory/proof_runner.ts`

## Observed Output

```text
[DETERMA] TASK START
[DETERMA] TASK_HALTED
[DETERMA] ESCALATION_REQUIRED
{"target":"examples/auth_bug/auth.py","prompt":"Fix password mismatch bug","failureCount":3,"previousFailures":[]}
[DETERMA] METRICS SUMMARY
{
  "mutations": 0,
  "rollbacks": 0,
  "halts": 1,
  "escalations": 1,
  "estimatedTokens": 0
}
```

## Conclusion

Escalation is emitted as a deterministic boundary JSON artifact after local containment is exhausted.

