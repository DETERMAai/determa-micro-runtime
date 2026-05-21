const failuresByTarget = new Map<string, number>();
const haltedTargets = new Set<string>();

export function recordTargetFailure(target: string): void {
  const current = failuresByTarget.get(target) ?? 0;
  failuresByTarget.set(target, current + 1);
}

export function shouldHalt(target: string): boolean {
  return (failuresByTarget.get(target) ?? 0) >= 3;
}

export function markTaskHalted(target: string): void {
  haltedTargets.add(target);
}

export function wasTaskHalted(target: string): boolean {
  return haltedTargets.has(target);
}

export function getTargetFailureCount(target: string): number {
  return failuresByTarget.get(target) ?? 0;
}
