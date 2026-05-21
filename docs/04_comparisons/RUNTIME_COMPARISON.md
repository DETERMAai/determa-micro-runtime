# Runtime Comparison

Comparison focus: runtime containment behavior, not reasoning benchmark performance.

## Systems Compared

- DETERMA + Ollama
- OpenHands
- AutoGen
- CrewAI
- LangGraph
- Cursor Agent
- Claude Code
- Devin-style systems

## Runtime-Oriented Comparison

| System | Execution Stability | Containment | Determinism | Local Model Viability | Runtime Economics |
| --- | ---: | ---: | ---: | ---: | ---: |
| DETERMA + Ollama | 9 | 10 | 10 | 10 | 9 |
| OpenHands | 6 | 5 | 4 | 5 | 5 |
| AutoGen | 5 | 4 | 3 | 5 | 5 |
| CrewAI | 5 | 4 | 3 | 6 | 6 |
| LangGraph | 6 | 5 | 5 | 6 | 6 |
| Cursor Agent | 6 | 5 | 4 | 3 | 4 |
| Claude Code | 7 | 6 | 6 | 2 | 3 |
| Devin-style systems | 6 | 5 | 5 | 1 | 2 |

## Notes

- DETERMA is tuned for bounded autonomous mutation containment.
- Other systems are generally tuned for broader planning and orchestration workflows.
- Ratings are execution-runtime oriented and intentionally neutral.

