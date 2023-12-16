import { Hono } from 'hono';
import { Bindings } from "@src/bindings";

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
  const index = c.env.VECTORIZE_INDEX;
  const query = c.req.query('query');
  const api = c.env.PALM_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta2/models/embedding-gecko-001:embedText?key=${api}`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      text: query
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json() as Record<string, any>;
  const vector = data?.embedding?.value ?? null;
  if (!vector) {
    throw new Error('No vector');
  }
  const matches = await index.query(vector, { topK: 5, returnMetadata: true });
  return c.json(matches);
})

export default app;
