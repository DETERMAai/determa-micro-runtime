import { getTargetFailureCount, wasTaskHalted } from "../runtime/failure_convergence.js";

export function shouldEscalate(target: string): boolean {
  return wasTaskHalted(target) && getTargetFailureCount(target) >= 3;
}
