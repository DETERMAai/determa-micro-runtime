# MVP Status

DETERMA Micro Runtime currently targets deterministic operational proof, not production persistence.

## Current Limitations

- runtime state is process-local and in-memory for replay and failure convergence
- no durable replay state between process restarts
- single-target mutation workflow
- local filesystem-only execution model

## Persistence Model

- journal and metrics are append-only files
- replay guard and convergence state are non-persistent in current MVP

## Scope

- proof-oriented containment behavior
- deterministic deny/rollback/halt/escalation boundaries
- bounded autonomous mutation execution economics

## Production Gap

This MVP is intentionally minimal. It demonstrates deterministic runtime containment semantics without a production-grade persistence layer.

