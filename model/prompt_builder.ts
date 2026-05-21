export function buildPrompt(target: string, prompt: string): string {
  return `Modify only ${target}.\n${prompt}\nReturn code only.`;
}
