# DETERMA Micro Runtime

![Status](https://img.shields.io/badge/status-minimal_runtime_proof-1f5fae)
![Runtime](https://img.shields.io/badge/runtime-node.js-12324a)
![Gate](https://img.shields.io/badge/gate-fail_closed-5b6573)
![Production](https://img.shields.io/badge/production_claim-none-7a3e00)

**Minimal Node.js proof of a fail-closed runtime gate and chained decision receipts.**

This repository isolates a small set of runtime-governance mechanics so they can be inspected and exercised without the complexity of a full platform.

## Repository Boundary

| Dimension | Classification |
|---|---|
| Repository role | Minimal runtime proof |
| Runtime | Local Node.js scripts |
| Decision effect | Local process exit and proof behavior |
| External execution | Not implemented |
| Production readiness claim | None |

## Runtime Architecture

```mermaid
flowchart TB
    A[Proof scenario or runtime invocation]
    B[Runtime gate initializes]
    C[Existing receipts are loaded]
    D[Receipt-chain integrity is verified]
    E{Verification result}
    F[Validation boundary active]
    G[Fail-closed denial]
    H[Bounded proof continues]
    I[New receipt payload]
    J[Previous receipt hash]
    K[SHA-256 receipt hash]
    L[Receipt persisted to local storage]

    A --> B --> C --> D --> E
    E -->|valid| F --> H --> I
    E -->|invalid or error| G
    J --> I --> K --> L

    classDef input fill:#e8f1ff,stroke:#1f5fae,color:#102a43,stroke-width:2px;
    classDef gate fill:#eef7ff,stroke:#0f4c81,color:#102a43,stroke-width:2px;
    classDef allow fill:#edf8f1,stroke:#2d7a46,color:#173b25,stroke-width:2px;
    classDef deny fill:#fff1f0,stroke:#b42318,color:#5c1712,stroke-width:2px;
    classDef evidence fill:#f7fafc,stroke:#5b6573,color:#102a43;
    class A,B,C input;
    class D,E,F gate;
    class H allow;
    class G deny;
    class I,J,K,L evidence;
```

## Implemented Components

| Path or command | Purpose |
|---|---|
| `factory/runtime_gate.js` | Initializes the gate, verifies receipts and denies on error |
| `factory/receipt_writer.js` | Creates a locally persisted SHA-256-linked receipt |
| `npm run proof` | Runs the primary proof scenario |
| `npm run proof:rollback` | Exercises rollback-oriented proof behavior |
| `npm run proof:replay` | Exercises replay-oriented proof behavior |
| `npm run verify:receipts` | Verifies persisted receipt continuity |
| `npm run runtime:gate` | Runs the fail-closed validation boundary |
| `npm run receipt:write` | Persists a new chained receipt |

## Quickstart

```bash
npm install
npm run proof
npm run verify:receipts
npm run runtime:gate
```

## Design Principles Demonstrated

- validation occurs before bounded continuation;
- verification failure terminates the process with a denial;
- receipts link to the prior receipt hash;
- evidence is persisted separately from the proposed action;
- the proof favors explicit denial over silent continuation.

## Truth Boundary

This repository is intentionally minimal. It does **not** establish:

- enterprise-grade append-only storage;
- a production executor;
- complete mediation of external actions;
- customer deployment or validation;
- production identity, networking, availability or key-management controls;
- a full DETERMA Runtime Authority implementation.

## Core Statement

**The micro runtime demonstrates the shape of a fail-closed gate and a verifiable receipt chain; it is not a production control plane.**
