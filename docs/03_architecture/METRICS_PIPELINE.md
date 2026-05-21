# Metrics Pipeline

`runtime/metrics.ts` provides append-only runtime metrics logging.

## Storage

```text
metrics/runtime_metrics.jsonl
```

## Event Shape

```json
{
  "timestamp": "2026-05-21T00:00:00.000Z",
  "event": "MUTATION_REQUESTED",
  "tokens": 123,
  "target": "examples/auth_bug/auth.py",
  "localModel": "qwen2.5-coder:7b"
}
```

## Token Estimate

`estimateTokens(text) = ceil(text.length / 4)`

