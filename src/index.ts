import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { prettyJSON } from 'hono/pretty-json';
import { jwt } from 'hono/jwt';
import chatApp from "./apps/chat";
import imageApp from "./apps/image";
import searchApp from "./apps/search";
import authApp from "./apps/auth";
import { Bindings } from "@src/bindings";

const app = new OpenAPIHono<{Bindings: Bindings}>();

app.use("*", cors());
app.use('*', prettyJSON());
app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404))

app.get("/", (c) => c.text("Hello!"));

app.route("/auth", authApp);

app.use('/api/*', async (c, next) => {
  const secret = c.env.JWT_SECRET;
  const auth = jwt({ secret });
  return auth(c, next);
});
app.route("/api/v1/chat", chatApp);
app.route("/api/v1/image", imageApp);
app.route("/api/v1/search", searchApp);

app.get("/ui", swaggerUI({ url: "/docs" }));
app.doc("/docs", {
  info: {
    title: "An API",
    version: "v1",
  },
  openapi: "3.1.0",
});

export default app;
