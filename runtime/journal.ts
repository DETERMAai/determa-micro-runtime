import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

export function appendMutationJournal(
  journalPath: string,
  mutationHash: string,
  status: string,
): void {
  mkdirSync(dirname(journalPath), { recursive: true });
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    mutationHash,
    status,
  });
  appendFileSync(journalPath, `${line}\n`, "utf-8");
}

