import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../controllers/sendEmail.js'
import { UserModel } from '../models/user.js'
import { validatePartialUser } from '../shemas/user.js'
import { JWT, NODE_ENV } from '../configuration.js'

export class UserController {
  static register = async (req, res) => {
    // Realizamos la validacion de los datos enviados
    const result = validatePartialUser(req.body)

    // Validamos si existe un error en la validacion de los datos
    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    // Validamos que el email no exista en la base de datos
    const user = await UserModel.getByEmail({ email: result.data.email })
    if(user){
      return res.status(400).json({ error: 'Email already exists' })
    }

    const newUser = await UserModel.create({ input: result.data })

    res.status(201).json(newUser)
  }

  static login = async (req, res) => {
    // Realizamos la validacion de los datos enviados
    const result = validatePartialUser(req.body)
    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    try{
      const { email, password } = result.data

      // Validamos que el email existe
      const user = await UserModel.getByEmail({ email })
      if(!user) throw new Error('Email does not exist')

      // Validamos si la contraseña es correcta
      const isValid = await bcrypt.compare(password, user.password)
      if(!isValid) throw new Error('Invalid password')

      const { password: _, ...publicUser } = user
      
      // Creamos el token de acceso con JWT
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        JWT.SECRET,
        { 
          expiresIn: JWT.EXPIRES_IN
        }
      )

      // Se retorna la info del usuario y el token de acceso y la cookie
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60,
      })
      .send({ 
        user: publicUser, 
        token 
      })
    }catch(error){
      res.status(400).send({error:error.message})
    }
  }
  
  static logout = async (req, res) => {
    return res.clearCookie('access_token').status(200).send('Logged out')
  }

  static recoverPassword = async (req, res) => {
    const result = validatePartialUser(req.body)
    if(result.error){
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    try{
      const { email } = result.data

      // Validamos que el email existe
      const user = await UserModel.getByEmail({ email })
      if(!user) throw new Error('Email does not exist')

      const templateEmail = `
        <h1>Recuperacion de contraseña</h1>
        <p>Hola ${user.username}, para recuperar tu contraseña, haz click en el siguiente link:</p>
        <a href="http://localhost:3977/recover_password/${user.id}">Recuperar contraseña</a>
      `

      // Enviamos un email con el link de recuperacion de la contraseña
      const responseEmail = await sendEmail({
        to: user.email,
        subject: 'Recuperacion de contraseña',
        html: templateEmail,
      })

      // Validamos la respuesta del envio del email
      if(typeof responseEmail.messageId === undefined){
        throw new Error('Email not sent')
      }
      
      res.status(200).send({message: 'Email sent'})
    }catch(error){
      res.status(400).send({error: error.message})
    }
  }

  static updatedUser = async (req, res) => {
    // Validamos los datos resividos del usuario
    const result = validatePartialUser(req.body)
    if(result.error){
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    try {
      const { id } = req.params
      const updateUser = await UserModel.update({ id, input: result.data })

      if(!updateUser) throw new Error('User not found')

      res.status(200).json({ user: updateUser })
    } catch (error) {
      res.status(400).send(error.message)
    }
  }
} 