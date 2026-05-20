import { copyFileSync } from "node:fs";

export function backupFile(path: string): string {
  const backupPath = `${path}.bak`;
  copyFileSync(path, backupPath);
  return backupPath;
}

export function restoreFile(path: string): void {
  copyFileSync(`${path}.bak`, path);
}

