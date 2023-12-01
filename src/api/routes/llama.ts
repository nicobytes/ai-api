import { z, createRoute } from '@hono/zod-openapi';

const BodySchema = z.object({
  message: z.string()
});

const ResponseSchema = z.object({
  message: z.string()
});

const route = createRoute({
  method: 'post',
  path: '/llama',
  request: {
    body: {
      content: {
        'application/json': {
          schema: BodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ResponseSchema,
        },
      },
      description: 'Lamma completion',
    },
  },
});

export default route;
