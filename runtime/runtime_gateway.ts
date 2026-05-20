export function validateScope(path: string): boolean {
  return !path.includes("..");
}

export function validateExecutionBudget(prompt: string): boolean {
  return prompt.length <= 4000;
}

