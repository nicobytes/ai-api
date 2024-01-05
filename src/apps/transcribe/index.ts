import { OpenAPIHono, z } from "@hono/zod-openapi";
import { Bindings } from "@src/bindings";
import { generateTranscribe } from "@src/services/whisper";
import whisperRoute, { BodySchema } from "./routes/whisper";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

app.openapi(whisperRoute, async (c) => {
  const requestBody = await c.req.parseBody<z.infer<typeof BodySchema>>();
  const audioFile = requestBody.audio as File;
  const response = await generateTranscribe({
    audio: audioFile,
    AI: c.env.AI,
  });
  return c.json({ transcribe: response.text }, 201);
});

export default app;
