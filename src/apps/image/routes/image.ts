import { z, createRoute } from '@hono/zod-openapi';

const BodySchema = z.object({
  prompt: z.string(),
  num_steps: z.number()
});

const ResponseSchema = z.object({
  content_type: z.string(),
  format: z.string(),
  content: z.string()
});

const route = createRoute({
  method: 'post',
  path: '',
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
      description: 'Generate Image',
    },
  },
});


export default route;
