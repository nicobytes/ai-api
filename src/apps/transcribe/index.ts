import { OpenAPIHono, z } from "@hono/zod-openapi";
import { Bindings } from "@src/bindings";
import whisperRoute from "./routes/whisper";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

app.openapi(whisperRoute, async (c) => {
  const data = await c.req.formData();
  const audioFile = data.get("audio") as unknown as File;

  const blob = await audioFile.arrayBuffer();
  const audio = [...new Uint8Array(blob)];

  const gatewayUrl = `${c.env.AI_GATEWAY_URL}/workers-ai/@cf/openai/whisper`;
  try {
    const request = await fetch(gatewayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${c.env.CF_API_TOKEN}`,
      },
      body: JSON.stringify({ audio }),
    });
    if (!request.ok) {
      const detail = await request.text();
      return c.json({ error: request.statusText, detail }, request.status);
    }
    const response = (await request.json()) as { result: { text: string } };
    return c.json({ transcribe: response.result.text }, 200);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return c.json({ error: "Invalid JSON" }, 500);
    }
    return c.json({ error: error }, 500);
  }
});

export default app;
