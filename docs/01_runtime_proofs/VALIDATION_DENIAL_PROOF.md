# Validation Denial Proof

## Objective

Prove that invalid mutation payloads are denied before atomic apply and before pytest execution.

## Method

- Task: `factory/tasks/invalid_syntax.json`
- Mock response:

```text
def login(user, password)
return True
```

- Runner: `npx tsx factory/proof_runner.ts`

## Expected Runtime State

- `VALIDATION_DENIED` in journal.
- `VALIDATION_DENIED` in metrics.

## Observed Output

```text
[DETERMA] PROOF START
[DETERMA] MUTATION REQUESTED
[DETERMA] VALIDATION_DENIED
[DETERMA] PROOF VALIDATION_DENIED
```

## Conclusion

Validation gates block invalid syntax deterministically before mutation apply.

