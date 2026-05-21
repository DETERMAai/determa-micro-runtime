export interface ModelRequest {
  if (!normalized) {

    throw new ModelProviderError(
      "provider",
      "empty prompt"
    )
  }

  if (
    normalized.length >
    MAX_PROMPT_LENGTH
  ) {

    throw new ModelProviderError(
      "provider",
      "prompt too large"
    )
  }

  return normalized
}

export function validateModelText(
  text: string
): string {

  const normalized =
    text.trim()

  if (!normalized) {

    throw new ModelProviderError(
      "provider",
      "empty model response"
    )
  }

  if (
    normalized.length >
    MAX_RESPONSE_LENGTH
  ) {

    throw new ModelProviderError(
      "provider",
      "response too large"
    )
  }

  return normalized
}
