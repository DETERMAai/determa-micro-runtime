import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { mutationLoop, type MutationTask } from "../loop/mutation_loop";
import { recordMetric } from "../runtime/metrics";
import { shouldEscalate } from "./escalation_policy";
import { type EscalationTask } from "./escalation_task";

async function run(): Promise<void> {
  const repoRoot = process.cwd();
  const taskFile = process.argv[2] ?? "factory/tasks/auth_fix.json";
  const taskPath = resolve(repoRoot, taskFile);
  const task = JSON.parse(readFileSync(taskPath, "utf-8")) as MutationTask;

  console.log("[DETERMA] TASK START");
  const result = await mutationLoop(repoRoot, task);
  let escalations = 0;
  if (result.halted && shouldEscalate(resolve(repoRoot, task.target))) {
    const escalationTask: EscalationTask = {
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
}

run().catch((err) => {
  console.error("[DETERMA] LOOP FAILED");
  console.error(err);
  process.exit(1);
});
