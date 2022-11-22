import nodemailer from 'nodemailer'
import { htmlToText } from 'html-to-text'
import pug from 'pug'
import path from 'path'

class Email {
  constructor(user, url) {
    this.to = user.email
    this.firstName = user.name.split(' ')[0]
    this.url = url
    this.from = `G-Shop <${process.env.EMAIL_FROM}>`
  }

  newTransport() {
    // if (process.env.NODE_ENV === 'production') {
    // nodejs@pictusweb.sk
    return nodemailer.createTransport({
      pool: true,
      host: 'email.active24.com',
      port: 465,
      secure: true, // use TLS
      auth: {
        user: process.env.NODEJS_USERNAME,
        pass: process.env.NODEJS_PASSWORD,
      },
    })
  }

  // send the actual email
  async send(template, subject) {
    const __dirname = path.resolve()
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(
      `${__dirname}/backend/utils/mailTemplates/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
        // contact form
      }
    )

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      bcc: 'info@pictusweb.sk',
      subject,
      html,
      text: htmlToText(html),
    }

    // 3) Create a transport and send email

    await this.newTransport().sendMail(mailOptions)
  }

  async sendWelcome() {
    await this.send('welcome', 'Greetings from G-shop')
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    )
  }

  // contact Form
  async sendContactForm() {
    await this.send('Contact')
  }
}

export default Email
