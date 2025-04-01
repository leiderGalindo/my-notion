import nodemailer from 'nodemailer'
import { EMAIL } from '../configuration.js'

const config = {
  host: EMAIL.HOST,
  port: EMAIL.PORT,
  secure: true,
  auth: {
    user: EMAIL.USER,
    pass: EMAIL.PASSWORD,
  },
}

export const sendEmail = async ({ to, subject, html }) => {  
  const transporter = nodemailer.createTransport(config)
  const info = await transporter.sendMail({
    from: '"My Notion" <my-notion@gmail.com>',
    to,
    subject,
    html,
  })

  return info
}