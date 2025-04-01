import bcrypt from "bcrypt" 
import { Connection } from "./connection.js"
import { ulid } from "ulid"
import { JWT } from "../configuration.js"

const connection = await Connection()
export class UserModel {

  static getByEmail = async ({ email }) => {
    const [ user ] = await connection.query(
      `
        SELECT id, username, email, password, profile_image_url, created_at, updated_at
        FROM users
        WHERE email = ?
      `,
      [
        email
      ]
    )

    if(user.length === 0) return null

    return user[0]
  }

  static getById = async ({ id }) => {
    if(!id) return null
    
    const [ user ] = await connection.query(
      `
        SELECT id, username, email, password, profile_image_url, created_at, updated_at
        FROM users
        WHERE id = ?
      `,
      [id]
    )
    
    if(user.length === 0) return null

    return user[0]
  }

  static create = async ({ input }) => {
    const { username, email, password } = input
    const hashedPassword = await bcrypt.hash(password, JWT.SALT_ROUNDS)
    const id = ulid()

    try{
      const result = await connection.query(
        `
          INSERT INTO users (id, username, email, password)
          VALUES ("${id}", ?, ?, ?) 
        `,
        [
          username,
          email,
          hashedPassword,
        ]
      ) 
    }catch(error){
      console.log('error', error)
      throw new Error(error)
      return null
    }
    const user = await this.getById({ id })

    return user
  }

  static update = async ({ id, input }) => {
    const user = await this.getById({ id })

    // Validamos que el usuario exista
    if(!user) return false

    // Validamos si se va a actualizar la contraseña
    if(typeof input.password !== 'undefined'){
      const hashedPassword = await bcrypt.hash(input.password, JWT.SALT_ROUNDS)
      input.password = hashedPassword
    }

    const newUserData = { ...user, ...input }

    try{
      const [ result ] = await connection.query(
        `
          UPDATE users
          SET username = ?, email = ?, password = ?, profile_image_url = ?
          WHERE id = ?
        `,
        [
          newUserData.username,
          newUserData.email,
          newUserData.password,
          newUserData.profile_image_url,
          id,
        ]
      ) 

      // Validamos que la actualizacion haya sido exitosa
      if(result.affectedRows !== 1) return false

      return newUserData
    }catch(error){
      throw new Error(error)
      return false
    }
  }
}