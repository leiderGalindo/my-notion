import { Router } from 'express'
import { UserController } from '../controllers/user.js'

export const createUserRoutes = () => {
  const userRoutes = Router()

  userRoutes.get('/login', UserController.login)
  userRoutes.get('/register', UserController.create)
  userRoutes.get('/logout', UserController.logout)

  return userRoutes
}