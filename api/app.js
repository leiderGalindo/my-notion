import express, { json } from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import { createUserRoutes } from './routes/user.js'
import { PORT } from './configuration.js'

const app = express()

// Middleware de express para parsear el body de la petcion
app.use(json())

// Desactivamos la cabecera de express
app.disable('x-powered-by')

// Middleware de cors para controlar el acceso a la api
app.use(corsMiddleware())

// Routes
app.get('/', (req, res) => {
  res.send('Hello world!')
})

// Rutas de usuario
app.use('/user', createUserRoutes())

// Levantamos el sevidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})