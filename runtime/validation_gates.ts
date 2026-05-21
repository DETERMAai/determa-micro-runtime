import { execSync } from "node:child_process";
import { unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

export type ValidationGateResult = {
  allowed: boolean;
  reason?: string;
};

export function validateNonEmptyMutation(candidate: string): ValidationGateResult {
  const trimmed = candidate.trim();
  if (trimmed.length === 0) return { allowed: false, reason: "mutation_empty" };
  if (trimmed.length < 10) return { allowed: false, reason: "mutation_too_short" };
  return { allowed: true };
}

export function validateNoDestructiveMutation(candidate: string): ValidationGateResult {
  const trimmed = candidate.trim();
  if (trimmed.length === 0) return { allowed: false, reason: "full_file_removed" };
  const lower = candidate.toLowerCase();
  if (
    lower.includes("rm -rf") ||
    lower.includes("del /s") ||
    lower.includes("format") ||
    lower.includes("shutdown")
  ) {
    return { allowed: false, reason: "destructive_text_detected" };
  }
  return { allowed: true };
}

export function validatePythonSyntax(candidate: string): ValidationGateResult {
  const tempPath = join(tmpdir(), `determa_gate_${Date.now()}_${Math.random().toString(16).slice(2)}.py`);
  try {
    writeFileSync(tempPath, candidate, "utf-8");
    execSync(`python -m py_compile "${tempPath}"`, { stdio: "ignore" });
    return { allowed: true };
  } catch {
    return { allowed: false, reason: "python_syntax_invalid" };
  } finally {
    try {
      unlinkSync(tempPath);
    } catch {
      // ignore cleanup errors
    }
  }
}

export function runValidationGates(candidate: string): ValidationGateResult {
  const nonEmpty = validateNonEmptyMutation(candidate);
  if (!nonEmpty.allowed) return nonEmpty;
  const destructive = validateNoDestructiveMutation(candidate);
  if (!destructive.allowed) return destructive;
  const syntax = validatePythonSyntax(candidate);
  if (!syntax.allowed) return syntax;
  return { allowed: true };
}

