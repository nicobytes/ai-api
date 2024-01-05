import { Hono } from 'hono';
import { sign } from 'hono/jwt'
import { Bindings } from "@src/bindings";

const app = new Hono<{ Bindings: Bindings }>();

app.post('/login', async (c) => {
  const email = c.env.AUTH_EMAIL;
  const password = c.env.AUTH_PASSWORD;
  const data = await c.req.json();
  if (data.email === email && data.password === password) {
    const secret = c.env.JWT_SECRET;
    const access_token = await sign({sub: "12"}, secret);
    return c.json({ access_token });
  }
  return c.notFound();
});

export default app;
