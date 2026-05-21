import { generateLocal }
}

export async function generateModel(
  prompt: string
): Promise<ModelResult> {

  const provider =
    getProviderName()

  logProviderStartup(
    provider
  )

  if (provider === "freellmapi") {

    const healthy =
      await isFreeLLMHealthy()

    if (!healthy) {

      logProviderFallback(
        "freellmapi",
        "local"
      )

      const localResult =
        await generateLocal(prompt)

      return {
        text: localResult,
        provider: "local",
        fallbackUsed: true
      }
    }

    try {

      const result =
        await tryFreeLLM(
          prompt
        )

      return {
        text: result,
        provider: "freellmapi",
        fallbackUsed: false
      }

    } catch {

      logProviderFallback(
        "freellmapi",
        "local"
      )

      const localResult =
        await generateLocal(prompt)

      return {
        text: localResult,
        provider: "local",
        fallbackUsed: true
      }
    }
  }

  const localResult =
    await generateLocal(prompt)

  return {
    text: localResult,
    provider: "local",
    fallbackUsed: false
  }
}
