const failed = new Set<string>();

export function seenFailure(hash: string): boolean {
  return failed.has(hash);
}

export function recordFailure(hash: string): void {
  failed.add(hash);
}

