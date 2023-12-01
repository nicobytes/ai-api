import { OpenAPIHono } from "@hono/zod-openapi";
import { testClient } from 'hono/testing';

it('test open api', async () => {
  const app = new OpenAPIHono().get('/search', (c) => c.jsonT({ hello: 'world' }))
  const res = await testClient(app).search.$get()

  expect(await res.json()).toEqual({ hello: 'world' })
});
