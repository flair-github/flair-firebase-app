import { CHAMUDI_MAIL_APP_PASSWORD } from '../config'
import nodemailer from 'nodemailer'

export const emailSender = async () => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'chamudi@flairlabs.ai',
      pass: CHAMUDI_MAIL_APP_PASSWORD,
    },
  })

  const mailOptions = {
    from: 'chamudi@flairlabs.ai',
    to: 'ezzat.chamudi@gmail.com',
    subject: 'Hello from Nodemailer',
    text: 'This is an email from Flair Firebase.',
  }

  await transporter.sendMail(mailOptions)
}
