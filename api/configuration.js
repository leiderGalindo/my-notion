import dotenv from 'dotenv'
dotenv.config()

export const {
  PORT = (process.env.PORT || 3977),
  DATABASE = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DATABASE: process.env.DB_DATABASE,
  },
  JWT = {
    SALT_ROUNDS: 10,
    SECRET: process.env.JWT_SECRET,
    EXPIRES_IN: process.env.JWT_EXPIRES_IN
  },
  NODE_ENV = process.env.NODE_ENV || 'development',
  EMAIL = {
    HOST: (process.env.HOST_EMAIL || 'smtp.gmail.com'),
    PORT: (process.env.PORT_EMAIL || 465),
    USER: (process.env.USER_EMAIL || ''),
    PASSWORD: (process.env.PASSWORD_EMAIL || ''),
  }
} = process.env