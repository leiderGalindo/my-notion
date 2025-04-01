import mysql from "mysql2/promise.js"
import { DATABASE } from "../configuration.js"

const configConnection = {
  host: DATABASE.HOST,
  user: DATABASE.USER,
  password: DATABASE.PASSWORD,
  database: DATABASE.DATABASE,
}

export const Connection = async () => {
  const connection = await mysql.createConnection(configConnection)

  return connection
}