import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { mutationLoop, type MutationTask } from "../loop/mutation_loop.js";
import { runTaskRunner } from "./task_runner.js";

function readTask(repoRoot: string, taskPath: string): MutationTask {
  return JSON.parse(readFileSync(resolve(repoRoot, taskPath), "utf-8")) as MutationTask;
}

function fileContains(path: string, token: string): boolean {
  try {
    return readFileSync(path, "utf-8").includes(token);
  } catch {
    return false;
  }
}

async function runProof(): Promise<void> {
  const repoRoot = process.cwd();
  const journalPath = resolve(repoRoot, "journal/mutations.log");
  const metricsPath = resolve(repoRoot, "metrics/runtime_metrics.jsonl");
  const authPath = resolve(repoRoot, "examples/auth_bug/auth.py");
  const baselineAuth = `def login(user, password):\n    if user == "admin" and password == "123":\n        return True\n    return False\n`;

  rmSync(journalPath, { force: true });
  rmSync(metricsPath, { force: true });
  writeFileSync(authPath, baselineAuth, "utf-8");

  console.log("[DETERMA] PROOF START");

  // Scenario A: VALIDATION_DENIED
  process.env.DETERMA_MOCK_RESPONSE = "def login(user, password)\nreturn True";
  await mutationLoop(repoRoot, readTask(repoRoot, "factory/tasks/invalid_syntax.json"), 1);
  if (!fileContains(journalPath, "VALIDATION_DENIED") || !fileContains(metricsPath, "VALIDATION_DENIED")) {
    throw new Error("proof_failed_validation_denied");
  }
  console.log("[DETERMA] PROOF VALIDATION_DENIED");

  // Scenario B: TASK_HALTED
  process.env.DETERMA_MOCK_RESPONSE = "def login(user, password):\n    return False";
  await mutationLoop(repoRoot, readTask(repoRoot, "factory/tasks/auth_fix_halt.json"), 1);
  process.env.DETERMA_MOCK_RESPONSE = "def login(user, password):\n    return False  # fail_2";
  await mutationLoop(repoRoot, readTask(repoRoot, "factory/tasks/auth_fix_halt.json"), 1);
  process.env.DETERMA_MOCK_RESPONSE = "def login(user, password):\n    return False  # halt_check";
  await mutationLoop(repoRoot, readTask(repoRoot, "factory/tasks/auth_fix_halt.json"), 1);
  if (!fileContains(journalPath, "TASK_HALTED")) {
    throw new Error("proof_failed_task_halted");
  }
  console.log("[DETERMA] PROOF TASK_HALTED");

  // Scenario C: ESCALATION_REQUIRED
  process.env.DETERMA_MOCK_RESPONSE = "def login(user, password):\n    return False  # escalation";
  const escalation = await runTaskRunner(repoRoot, "factory/tasks/auth_fix_halt.json");
  if (!escalation.escalated || !escalation.escalationTask) {
    throw new Error("proof_failed_escalation_required");
  }
  console.log("[DETERMA] PROOF ESCALATION_REQUIRED");
  console.log("[DETERMA] PROOF COMPLETE");
}

runProof().catch((err) => {
  console.error("[DETERMA] LOOP FAILED");
  console.error(err);
  process.exit(1);
});
