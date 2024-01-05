import { z, createRoute } from "@hono/zod-openapi";

const BodySchema = z.object({
  email: z.string(),
  password: z.string(),
});

const ResponseSchema = z.object({
  access_token: z.string(),
});


const ErrorSchema = z.object({
  message: z.string(),
});

const route = createRoute({
  method: "post",
  path: "/login",
  request: {
    body: {
      content: {
        "application/json": {
          schema: BodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Access Token",
      content: {
        "application/json": {
          schema: ResponseSchema,
        },
      },
    },
    401: {
      description: "Invalid Credentials",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

export default route;
