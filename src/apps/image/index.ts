import { OpenAPIHono } from "@hono/zod-openapi";
import { Bindings } from "@src/bindings";
import { generateImage } from "@src/services/image";
import { Buffer } from 'node:buffer';
import imageRoute from "./routes/image";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

app.openapi(imageRoute, async (c) => {
  const { prompt, num_steps } = await c.req.json();
  const imageArray = await generateImage({ prompt, num_steps, AI: c.env.AI });
  return c.json({
    content_type: "image/png",
    format: "base64",
    content: Buffer.from(imageArray).toString("base64"),
  }, 201);
});

export default app;
