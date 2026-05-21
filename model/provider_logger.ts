export function logProviderEvent(
}

export function warnProviderEvent(
  provider: string,
  message: string
) {

  console.warn(
    `[${provider}] ${message}`
  )
}

export function errorProviderEvent(
  provider: string,
  message: string
) {

  console.error(
    `[${provider}] ${message}`
  )
}

export function logProviderFallback(
  from: string,
  to: string
) {

  console.warn(
    `[provider-fallback] from=${from} to=${to}`
  )
}

export function logProviderRetry(
  provider: string,
  attempt: number
) {

  console.warn(
    `[${provider}] retry_attempt=${attempt}`
  )
}

export function logProviderSuccess(
  provider: string,
  latencyMs: number
) {

  console.info(
    `[${provider}] success latency_ms=${latencyMs}`
  )
}

export function logProviderStartup(
  provider: string
) {

  console.info(
    `[${provider}] initialized`
  )
}

export function logProviderCompletion(
  provider: string,
  status: "success" | "fallback" | "failure"
) {

  console.info(
    `[${provider}] completed status=${status}`
  )
}
