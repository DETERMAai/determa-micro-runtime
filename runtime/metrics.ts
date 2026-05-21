import { appendFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

export type RuntimeMetric = {
  timestamp: string;
  event: string;
  tokens?: number;
  rollback?: boolean;
  halted?: boolean;
  escalated?: boolean;
  localModel?: string;
  target?: string;
};

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function recordMetric(event: RuntimeMetric): void {
  const metricsPath = resolve(process.cwd(), "metrics/runtime_metrics.jsonl");
  mkdirSync(dirname(metricsPath), { recursive: true });
  appendFileSync(metricsPath, `${JSON.stringify(event)}\n`, "utf-8");
}

