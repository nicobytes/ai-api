import { OpenAPIHono } from "@hono/zod-openapi";
import { sign } from 'hono/jwt'
import { Bindings } from "@src/bindings";
import loginRoute from "./routes/login";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

app.openapi(loginRoute, async (c) => {
  const email = c.env.AUTH_EMAIL;
  const password = c.env.AUTH_PASSWORD;
  const data = await c.req.json();
  if (data.email === email && data.password === password) {
    const secret = c.env.JWT_SECRET;
    const access_token = await sign({sub: email}, secret);
    return c.json({ access_token }, 200);
  } else {
    return c.json({ message: "Invalid Credentials" }, 401);
  }
});

export default app;
