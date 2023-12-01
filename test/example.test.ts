import { Hono } from 'hono'
import { testClient } from 'hono/testing'

it('test hono app', async () => {
  const app = new Hono().get('/search', (c) => c.jsonT({ hello: 'world' }))
  const res = await testClient(app).search.$get()

  expect(await res.json()).toEqual({ hello: 'world' })
})
