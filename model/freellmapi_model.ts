import crypto from "node:crypto"
      "success"
    )

    return normalized

  } catch (err: any) {

    if (
      err instanceof DOMException &&
      err.name === "AbortError"
    ) {

      warnProviderEvent(
        "freellmapi",
        `request_id=${requestId} timeout_ms=15000`
      )

      throw new ModelProviderError(
        "freellmapi",
        "request timeout"
      )
    }

    if (
      err instanceof TypeError
    ) {

      warnProviderEvent(
        "freellmapi",
        `request_id=${requestId} network_failure="${err.message}"`
      )

      throw new ModelProviderError(
        "freellmapi",
        "network failure"
      )
    }

    errorProviderEvent(
      "freellmapi",
      err.message
    )

    logProviderCompletion(
      "freellmapi",
      "failure"
    )

    throw err

  } finally {

    clearTimeout(timeout)
  }
}
