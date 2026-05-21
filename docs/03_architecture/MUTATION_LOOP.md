# Mutation Loop

`loop/mutation_loop.ts` is the deterministic execution worker.

## Flow

```text
task -> prompt -> one mutation -> validation gates -> apply -> test -> deny/rollback or allow -> journal
```

## Deterministic Controls

- one mutation request per iteration
- scope and prompt budget checks
- replay denial
- validation gate denial before apply
- convergence halt at failure threshold

