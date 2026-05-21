import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { requestOneMutation } from "../model/local_model.js";
import { buildPrompt } from "../model/prompt_builder.js";
import {
  getTargetFailureCount,
  markTaskHalted,
  recordTargetFailure,
  shouldHalt,
} from "../runtime/failure_convergence.js";
import { appendMutationJournal } from "../runtime/journal.js";
import { estimateTokens, recordMetric } from "../runtime/metrics.js";
import { recordFailure, seenFailure } from "../runtime/replay_guard.js";
import { backupFile, restoreFile } from "../runtime/rollback.js";
import { validateExecutionBudget, validateScope } from "../runtime/runtime_gateway.js";
import { runValidationGates } from "../runtime/validation_gates.js";

function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed.startsWith("```")) return text;
  const lines = trimmed.split("\n");
  return lines.slice(1, lines.length - 1).join("\n");
}

export type MutationTask = {
  target: string;
  prompt: string;
  test: string;
  model: string;
};

export type MutationLoopResult = {
  halted: boolean;
  failureCount: number;
  previousFailures: string[];
  mutations: number;
  rollbacks: number;
  halts: number;
  estimatedTokens: number;
};

export async function mutationLoop(
  repoRoot: string,
  task: MutationTask,
  maxSteps = 1,
): Promise<MutationLoopResult> {
  const authPath = resolve(repoRoot, task.target);
  const testCwd = dirname(authPath);
  const journalPath = resolve(repoRoot, "journal/mutations.log");
  const previousFailures: string[] = [];
  let halted = false;
  let mutations = 0;
  let rollbacks = 0;
  let halts = 0;
  let estimatedTokens = 0;

  for (let i = 0; i < maxSteps; i += 1) {
    const current = readFileSync(authPath, "utf-8");
    const prompt = `${buildPrompt(task.target, task.prompt)}\n\nCurrent file:\n${current}`;
    if (!validateExecutionBudget(prompt)) {
      throw new Error("prompt budget exceeded");
    }
    if (!validateScope(authPath)) {
      throw new Error("scope validation failed");
    }
    if (shouldHalt(authPath)) {
      appendMutationJournal(journalPath, authPath, "TASK_HALTED");
      console.log("[DETERMA] TASK_HALTED");
      recordMetric({
        timestamp: new Date().toISOString(),
        event: "TASK_HALTED",
        halted: true,
        target: authPath,
      });
      markTaskHalted(authPath);
      halted = true;
      halts += 1;
      break;
    }

    console.log("[DETERMA] MUTATION REQUESTED");
    mutations += 1;
    const promptTokens = estimateTokens(prompt);
    recordMetric({
      timestamp: new Date().toISOString(),
      event: "MUTATION_REQUESTED",
      tokens: promptTokens,
      localModel: task.model,
      target: authPath,
    });
    const mutation = await requestOneMutation(task.model, prompt);
    const candidate = stripCodeFence(mutation).trim();
    const responseTokens = estimateTokens(candidate);
    estimatedTokens += promptTokens + responseTokens;
    recordMetric({
      timestamp: new Date().toISOString(),
      event: "MUTATION_REQUESTED",
      tokens: responseTokens,
      localModel: task.model,
      target: authPath,
    });
    const hash = createHash("sha256").update(candidate).digest("hex");

    if (seenFailure(hash)) {
      appendMutationJournal(journalPath, hash, "REPLAY_DENIED");
      continue;
    }
    const gate = runValidationGates(candidate);
    if (!gate.allowed) {
      recordTargetFailure(authPath);
      recordFailure(hash);
      previousFailures.push(hash);
      appendMutationJournal(journalPath, hash, "VALIDATION_DENIED");
      recordMetric({
        timestamp: new Date().toISOString(),
        event: "VALIDATION_DENIED",
        target: authPath,
      });
      console.log("[DETERMA] VALIDATION_DENIED");
      continue;
    }

    backupFile(authPath);
    const tmpPath = `${authPath}.tmp`;
    writeFileSync(tmpPath, `${candidate}\n`, "utf-8");
    renameSync(tmpPath, authPath);

    try {
      execSync(task.test, { cwd: testCwd, stdio: "ignore" });
      appendMutationJournal(journalPath, hash, "EXECUTION_ALLOWED");
    } catch {
      restoreFile(authPath);
      recordTargetFailure(authPath);
      recordFailure(hash);
      previousFailures.push(hash);
      appendMutationJournal(journalPath, hash, "EXECUTION_DENIED");
      recordMetric({
        timestamp: new Date().toISOString(),
        event: "EXECUTION_DENIED",
        target: authPath,
      });
      console.log("[DETERMA] EXECUTION_DENIED");
      rollbacks += 1;
      recordMetric({
        timestamp: new Date().toISOString(),
        event: "ROLLBACK_APPLIED",
        rollback: true,
        target: authPath,
      });
      console.log("[DETERMA] ROLLBACK APPLIED");
    }
  }

  return {
    halted,
    failureCount: getTargetFailureCount(authPath),
    previousFailures,
    mutations,
    rollbacks,
    halts,
    estimatedTokens,
  };
}
