# Execution Stability Metrics

DETERMA metrics quantify containment efficiency for bounded autonomous mutation execution.

## Core Metrics

- rollback containment rate
  - fraction of execution-denied paths restored to prior state
- retry collapse prevention
  - rate at which repeated failures converge to `TASK_HALTED`
- escalation efficiency
  - frequency of escalation only after local containment is exhausted
- token compression efficiency
  - estimated token usage per bounded single-mutation attempt
- bounded execution economics
  - total mutation attempts, denials, halts, and escalations per task

## Runtime Signals

Source: `metrics/runtime_metrics.jsonl`

- `MUTATION_REQUESTED`
- `VALIDATION_DENIED`
- `EXECUTION_DENIED`
- `ROLLBACK_APPLIED`
- `TASK_HALTED`
- `ESCALATION_REQUIRED`

## Summary Output

Per task, task runner emits:

```json
{
  "mutations": 0,
  "rollbacks": 0,
  "halts": 1,
  "escalations": 1,
  "estimatedTokens": 0
}
```

