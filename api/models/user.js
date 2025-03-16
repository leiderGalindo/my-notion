import bcrypt from "bcrypt" 
import mysql from "mysql2/promise.js"
import { ulid } from "ulid"
import { DATABASE, JWT } from "../configuration.js"

const configConnection = {
  host: DATABASE.HOST,
  user: DATABASE.USER,
  password: DATABASE.PASSWORD,
  database: DATABASE.DATABASE,
}

const connection = await mysql.createConnection(configConnection)

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
        SELECT id, username, email, profile_image_url, created_at, updated_at
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
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS.SALT_ROUNDS)
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
}