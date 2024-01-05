import { OpenAPIHono } from "@hono/zod-openapi";
import { Bindings } from "@src/bindings";
import { buildLlamaChain } from "@src/chains/llama_chain";
import { buildCodeLlamaChain } from "@src/chains/code_llama_chain";
import { buildOpenAIChain } from "@src/chains/openai_chain";
import { buildCodeLlamaChain } from "@src/chains/code_llama_chain";
import llamaRoute from "./routes/llama";
import codeLlamaRoute from "./routes/code_llama";
import openAiRoute from "./routes/openai";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

app.openapi(codeLlamaRoute, async (c) => {
  const { message } = await c.req.json();
  const chain = await buildCodeLlamaChain({
    cloudflareAccountId: c.env.CLOUDFLARE_ACCOUNT_ID,
    cloudflareApiToken: c.env.CLOUDFLARE_API_TOKEN,
    baseUrl: c.env.AI_GATEWAY_URL,
  });
  const inputs = { input: message };
  const responseMsg = await chain.invoke(inputs);
  return c.json({ message: responseMsg }, 201);
});

app.openapi(llamaRoute, async (c) => {
  const { message } = await c.req.json();
  const chain = await buildLlamaChain({
    cloudflareAccountId: c.env.CLOUDFLARE_ACCOUNT_ID,
    cloudflareApiToken: c.env.CLOUDFLARE_API_TOKEN,
    baseUrl: c.env.AI_GATEWAY_URL,
  });
  const inputs = { input: message };
  const responseMsg = await chain.invoke(inputs);
  return c.json({ message: responseMsg }, 201);
});

app.openapi(codeLlamaRoute, async (c) => {
  const { message } = await c.req.json();
  const chain = await buildCodeLlamaChain({
    cloudflareAccountId: c.env.CLOUDFLARE_ACCOUNT_ID,
    cloudflareApiToken: c.env.CLOUDFLARE_API_TOKEN,
    baseUrl: c.env.AI_GATEWAY_URL,
  });
  const inputs = { input: message };
  const responseMsg = await chain.invoke(inputs);
  return c.json({ message: responseMsg }, 201);
});

app.openapi(openAiRoute, async (c) => {
  const { message } = await c.req.json();
  const chain = await buildOpenAIChain({
    openAIApiKey: c.env.OPENAI_API_KEY,
  });
  const inputs = { input: message };
  const responseMsg = await chain.invoke(inputs);
  return c.json({ message: responseMsg }, 201);
});

export default app;
