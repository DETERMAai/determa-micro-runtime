export async function requestOneMutation(
  model: string,
  prompt: string,
): Promise<string> {
  const res = await fetch("http://127.0.0.1:11434/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
    }),
  });

  if (!res.ok) {
    throw new Error(`ollama request failed: ${res.status}`);
  }

  const data = (await res.json()) as { response?: string };
  if (!data.response) {
    throw new Error("empty model response");
  }
  return data.response;
}

