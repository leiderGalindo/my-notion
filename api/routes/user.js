import { Router } from 'express'
import { UserController } from '../controllers/user.js'

export const createUserRoutes = () => {
  const userRoutes = Router()

  userRoutes.post('/register', UserController.register)
  userRoutes.post('/login', UserController.login)
  userRoutes.get('/logout', UserController.logout)
  userRoutes.post('/recover_password', UserController.recoverPassword)
  userRoutes.patch('/:id', UserController.updatedUser) 

  return userRoutes
}