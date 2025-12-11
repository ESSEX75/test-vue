import jsonServer from 'json-server'

const server = jsonServer.create()
const router = jsonServer.router('mocks/db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

server.post('/api/login', (req, res) => {
  const { user, password } = req.body

  const users = router.db.get('users').value()

  console.warn('users', users)

  const currentUser = users.find((item) => item.user === user && item.password === password)

  if (!currentUser) {
    return res.status(401).json({ code: 'UNAUTHORIZED' })
  }

  const response = {
    name: currentUser.name,
    role: currentUser.role,
  }

  if (currentUser.accessToken) {
    response.accessToken = currentUser.accessToken
  }

  res.json(response)
})

server.get('/api/orders', (req, res) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const token = authHeader.replace('Bearer ', '').trim()

  const users = router.db.get('users').value()
  const currentUser = users.find((u) => u.accessToken === token)

  if (!currentUser) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  // По сути мы на беке можем вытащить из токена айди и по нему запросить список заказов
  const orders = router.db.get('events').value()

  return res.json(orders)
})

server.post('/api/orders-add', (req, res) => {
  const { name, address, comment, date, status } = req.body

  const db = router.db

  const newOrder = {
    id: address.length,
    name,
    address,
    comment: comment || '',
    date,
    status,
  }

  db.get('events').push(newOrder).write()

  return res.json(db.get('events').value())
})

server.delete('/api/orders/:id', (req, res) => {
  const id = Number(req.params.id)

  const db = router.db
  const events = db.get('events').value()

  const exists = events.some((e) => e.id === id)

  if (!exists) {
    return res.status(404).json({ message: 'Order not found' })
  }

  db.get('events').remove({ id }).write()

  return res.json(db.get('events').value())
})

const PORT = 3000
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`)
  console.log(`Mock endpoints:`)
  console.log(`  POST http://localhost:${PORT}/api/login`)
  console.log(`  GET  http://localhost:${PORT}/orders`)
  console.log(`  GET  http://localhost:${PORT}/users`)
})
