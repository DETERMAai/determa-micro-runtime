import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { mutationLoop, type MutationTask } from "../loop/mutation_loop.js";
import { recordMetric } from "../runtime/metrics.js";
import { shouldEscalate } from "./escalation_policy.js";
import { type EscalationTask } from "./escalation_task.js";

export type TaskRunnerResult = {
  escalated: boolean;
  escalationTask?: EscalationTask;
};

export async function runTaskRunner(
  repoRoot = process.cwd(),
  taskFile = "factory/tasks/auth_fix.json",
): Promise<TaskRunnerResult> {
  const taskPath = resolve(repoRoot, taskFile);
  const task = JSON.parse(readFileSync(taskPath, "utf-8")) as MutationTask;

  console.log("[DETERMA] TASK START");
  const result = await mutationLoop(repoRoot, task);
  let escalations = 0;
  let escalationTask: EscalationTask | undefined;
  if (result.halted && shouldEscalate(resolve(repoRoot, task.target))) {
    escalationTask = {
      target: task.target,
      prompt: task.prompt,
      failureCount: result.failureCount,
      previousFailures: result.previousFailures,
    };
    escalations = 1;
    recordMetric({
      timestamp: new Date().toISOString(),
      event: "ESCALATION_REQUIRED",
      escalated: true,
      target: resolve(repoRoot, task.target),
      localModel: task.model,
    });
    console.log("[DETERMA] ESCALATION_REQUIRED");
    console.log(JSON.stringify(escalationTask));
  }
  console.log("[DETERMA] METRICS SUMMARY");
  console.log(
    JSON.stringify(
      {
        mutations: result.mutations,
        rollbacks: result.rollbacks,
        halts: result.halts,
        escalations,
        estimatedTokens: result.estimatedTokens,
      },
      null,
      2,
    ),
  );
  console.log("[DETERMA] LOOP COMPLETE");
  if (escalationTask) {
    return { escalated: true, escalationTask };
  }
  return { escalated: false };
}

if (process.argv[1] && process.argv[1].includes("task_runner.ts")) {
  const taskFile = process.argv[2] ?? "factory/tasks/auth_fix.json";
  runTaskRunner(process.cwd(), taskFile).catch((err) => {
    console.error("[DETERMA] LOOP FAILED");
    console.error(err);
    process.exit(1);
  });
}
