# Validation Gates

`runtime/validation_gates.ts` blocks obviously invalid mutations before atomic apply.

## Gate Order

1. non-empty and minimum length
2. destructive text detection
3. python syntax compile check

## Deny Outcome

- journal status: `VALIDATION_DENIED`
- metric event: `VALIDATION_DENIED`
- mutation not applied
- pytest not executed

