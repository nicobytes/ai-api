import { Hono } from 'hono';
import { sign } from 'hono/jwt'
import { basicAuth } from 'hono/basic-auth';
import { Bindings } from "@src/bindings";

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', async (c, next) => {
  const username = c.env.USER;
  const password = c.env.PASSWORD;
  const middleware = basicAuth({ username, password });
  return middleware(c, next);
});

app.post('/login', (c) => {
  const username = c.env.USER;
  const password = c.env.PASSWORD;
  const secret = c.env.JWT_SECRET;
  const access_token = sign({ username: 'nicobytes' }, secret);
  return c.json({ access_token });
});

export default app;
