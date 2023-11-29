import { Hono } from 'hono'
import { cors } from 'hono/cors'
import chat from './api/chat'

const app = new Hono()
app.use('/*', cors())
app.get('/', (c) => c.text('Hello!'))
app.route('/chat', chat)

export default app
