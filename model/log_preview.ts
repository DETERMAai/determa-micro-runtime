import { sanitizeLogText }
  from "./log_sanitizer.js"

const PREVIEW_LENGTH = 120

export function createLogPreview(
  text: string
): string {

  return sanitizeLogText(
    text
      .slice(0, PREVIEW_LENGTH)
      .replace(/\n/g, " ")
      .trim()
  )
}
