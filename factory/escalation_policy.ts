import { getTargetFailureCount, wasTaskHalted } from "../runtime/failure_convergence";

export function shouldEscalate(target: string): boolean {
  return wasTaskHalted(target) && getTargetFailureCount(target) >= 3;
}

