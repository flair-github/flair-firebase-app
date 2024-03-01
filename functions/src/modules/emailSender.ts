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

  const mailOptions1 = {
    from: 'chamudi@flairlabs.ai',
    to: 'ezzat.chamudi@gmail.com',
    subject: mailSubject,
    text: mailText,
  }

  const mailOptions2 = {
    from: 'chamudi@flairlabs.ai',
    to: 'samir@flairlabs.ai',
    subject: mailSubject,
    text: mailText,
  }

  await Promise.allSettled([transporter.sendMail(mailOptions1), transporter.sendMail(mailOptions2)])
}

const mailSubject = 'Next Steps Towards Your Dream Home!'

const mailText = `
Dear Samir Sen,

I hope this email finds you well. It was a pleasure speaking with you recently and hearing about your aspirations for your next home. At SF Real Estate, we are committed to turning those aspirations into reality.

Following our conversation, I've carefully considered your preferences and requirements, and I'm excited to present you with options that not only meet but exceed your expectations. Here's a brief overview of how we can move forward together:

Curated Selections: Based on our discussion, I'll be handpicking properties that align with your vision. Expect a personalized list in your inbox soon.
Scheduled Viewings: Let me know a convenient time for you, and I'll arrange private viewings of your chosen properties.
Expert Insights: I'll provide in-depth details and answers to all your queries, ensuring you have all the information needed to make a confident decision.
Seamless Process: From negotiations to paperwork, consider it handled. Your journey to your dream home will be as smooth as possible.
I'm here to support you at every step, ensuring a seamless experience. Should you have any questions or need further assistance, please do not hesitate to reach out.

Thank you for considering SF Real Estate for your real estate needs. I look forward to our continued conversation and am excited about the opportunity to assist you further.

Warm regards,
Ezzat Chamudi
`
