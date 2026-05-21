# Escalation Policy

`factory/escalation_policy.ts` defines a strict escalation boundary.

## Rules

- escalate only after `TASK_HALTED`
- escalate only when local target failure count is `>= 3`

## Output

When rules are satisfied, task runner emits:

- console status: `ESCALATION_REQUIRED`
- deterministic JSON payload (`EscalationTask`)

