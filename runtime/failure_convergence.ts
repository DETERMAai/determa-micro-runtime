const failuresByTarget = new Map<string, number>();

export function recordTargetFailure(target: string): void {
  const current = failuresByTarget.get(target) ?? 0;
  failuresByTarget.set(target, current + 1);
}

export function shouldHalt(target: string): boolean {
  return (failuresByTarget.get(target) ?? 0) >= 3;
}

