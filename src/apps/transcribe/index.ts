import { OpenAPIHono, z } from "@hono/zod-openapi";
import { Bindings } from "@src/bindings";
import whisperRoute from "./routes/whisper";
import { getGatewayUrl } from "@src/utils/getGatewayUrl";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

app.openapi(whisperRoute, async (c) => {
  const data = await c.req.formData();
  const audioFile = data.get("audio") as unknown as File;

  const blob = await audioFile.arrayBuffer();
  const audio = [...new Uint8Array(blob)];

  const gatewayUrl = getGatewayUrl({
    endpoint: c.env.CF_AI_GATEWAY_ENDPOINT,
    account_id: c.env.CF_ACCOUNT_ID,
    slug: c.env.CF_AI_GATEWAY_SLUG,
    provider: c.env.CF_AI_GATEWAY_PROVIDER,
    model: "@cf/openai/whisper",
  });

  const request = await fetch(gatewayUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${c.env.CF_API_TOKEN}`,
    },
    body: JSON.stringify({ audio }),
  });
  const response = (await request.json()) as { result: { text: string } };
  return c.json({ transcribe: response.result.text }, 201);
});

export default app;
