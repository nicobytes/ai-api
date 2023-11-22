import { Hono } from "hono";
import { Bindings } from "@src/bindings";
import { buildLlamaChain } from "@src/chains/llama_chain";
import { buildOpenAIChain } from "@src/chains/openai_chain";

const app = new Hono<{ Bindings: Bindings }>();

app.post("/openai", async (c) => {
  const { message } = await c.req.json();
  const chain = await buildOpenAIChain({
    openAIApiKey: c.env.OPENAI_API_KEY,
  });
  const inputs = { input: message };
  const result = await chain.invoke(inputs);
  return c.json(result, 201);
});

app.post("/llama", async (c) => {
  const { message } = await c.req.json();
  const chain = await buildLlamaChain({
    cloudflareAccountId: c.env.CLOUDFLARE_ACCOUNT_ID,
    cloudflareApiToken: c.env.CLOUDFLARE_API_TOKEN,
  });
  const inputs = { input: message };
  const result = await chain.invoke(inputs);
  return c.json(result, 201);
});

export default app;
