import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'

import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import mongooseServeces from './services/mongoose'
import User from './model/user.model'
import config from './config'
import Html from '../client/html'

const Root = () => ''

mongooseServeces.connect()
try {
  // eslint-disable-next-line import/no-unresolved
  // ;(async () => {
  //   const items = await import('../dist/assets/js/root.bundle')
  //   console.log(JSON.stringify(items))

  //   Root = (props) => <items.Root {...props} />
  //   console.log(JSON.stringify(items.Root))
  // })()
  console.log(Root)
} catch (ex) {
  console.log(' run yarn build:prod to enable ssr')
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

server.post('/api/v1/login', async (req, res) => {
  try {
    const user = await User.findAndValidateUSer(req.body)
    delete user.password
    const token = jwt.sign({ uid: user.id }, 'Secret_key', { expiresIn: '48h' })
    res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 48 })
    res.json({ token, user })
  } catch (e) {
    res.json({ status: e })
  }
})

server.post('/api/v1/register', async (req, res) => {
  res.json({ ok: 'users is created' })
})

server.get('/api/v1/login', async (req, res) => {
  try {
    const jwtUser = jwt.verify(req.cookies.token, 'Secret_key')
    const user = await User.findById(jwtUser.uid)
    delete user.password
    res.json({ status: 'ok', token: req.cookies.token, user })
    console.log(jwtUser)
  } catch (e) {
    res.json({ status: e })
  }
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Boilerplate'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)
