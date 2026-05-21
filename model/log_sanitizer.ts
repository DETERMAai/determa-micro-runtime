export function sanitizeLogText(
  text: string
): string {

  return text

    .replace(
      /sk-[a-zA-Z0-9]+/g,
      "[REDACTED_API_KEY]"
    )

    .replace(
      /Bearer\\s+[a-zA-Z0-9\\-\\._]+/gi,
      "Bearer [REDACTED]"
    )
}
