import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, renameSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { requestOneMutation } from "../model/local_model";
import { buildPrompt } from "../model/prompt_builder";
import { recordTargetFailure, shouldHalt } from "../runtime/failure_convergence";
import { appendMutationJournal } from "../runtime/journal";
import { recordFailure, seenFailure } from "../runtime/replay_guard";
import { backupFile, restoreFile } from "../runtime/rollback";
import { validateExecutionBudget, validateScope } from "../runtime/runtime_gateway";

function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed.startsWith("```")) return text;
  const lines = trimmed.split("\n");
  return lines.slice(1, lines.length - 1).join("\n");
}

export async function mutationLoop(
  repoRoot: string,
  model: string,
  maxSteps = 1,
): Promise<void> {
  const authPath = resolve(repoRoot, "examples/auth_bug/auth.py");
  const testCwd = resolve(repoRoot, "examples/auth_bug");
  const journalPath = resolve(repoRoot, "journal/mutations.log");

  for (let i = 0; i < maxSteps; i += 1) {
    const current = readFileSync(authPath, "utf-8");
    const prompt = `${buildPrompt()}\n\nCurrent auth.py:\n${current}`;
    if (!validateExecutionBudget(prompt)) {
      throw new Error("prompt budget exceeded");
    }
    if (!validateScope(authPath)) {
      throw new Error("scope validation failed");
    }
    if (shouldHalt(authPath)) {
      appendMutationJournal(journalPath, authPath, "TASK_HALTED");
      console.log("[DETERMA] TASK HALTED");
      break;
    }

    const mutation = await requestOneMutation(model, prompt);
    const candidate = stripCodeFence(mutation).trim();
    const hash = createHash("sha256").update(candidate).digest("hex");

    if (seenFailure(hash)) {
      appendMutationJournal(journalPath, hash, "REPLAY_DENIED");
      continue;
    }

    backupFile(authPath);
    const tmpPath = `${authPath}.tmp`;
    writeFileSync(tmpPath, `${candidate}\n`, "utf-8");
    renameSync(tmpPath, authPath);

    try {
      execSync("pytest -q", { cwd: testCwd, stdio: "ignore" });
      appendMutationJournal(journalPath, hash, "EXECUTION_ALLOWED");
    } catch {
      restoreFile(authPath);
      recordTargetFailure(authPath);
      recordFailure(hash);
      appendMutationJournal(journalPath, hash, "EXECUTION_DENIED");
    }
  }
}

const repoRoot = process.cwd();

mutationLoop(repoRoot, "qwen2.5-coder:7b")
  .then(() => {
    console.log("[DETERMA] LOOP COMPLETE");
  })
  .catch((err) => {
    console.error("[DETERMA] LOOP FAILED");
    console.error(err);
    process.exit(1);
  });
