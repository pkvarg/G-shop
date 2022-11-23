import nodemailer from 'nodemailer'
import { htmlToText } from 'html-to-text'
import pug from 'pug'
import path from 'path'

class Email {
  constructor(user, url) {
    this.to = user.email
    this.firstName = user.name
    this.url = url
    this.from = `G-Shop <${process.env.EMAIL_FROM}>`
    // order
    this.item = user.item
    this.street = user.street
    this.city = user.city
    this.zip = user.zip
    this.country = user.country
    this.price = user.price
    this.tax = user.tax
    this.total = user.total
    this.customerName = user.customerName
    this.email = user.email
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
        email: this.to,
        url: this.url,
        subject,
        // order
        item: this.item,
        street: this.street,
        city: this.city,
        zip: this.zip,
        country: this.country,
        price: this.price,
        tax: this.tax,
        total: this.total,
        customerName: this.customerName,
        email: this.email,
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

  async sendOrderToEmail() {
    await this.send('orderToEmail', 'Your order')
  }

  // contact Form
  async sendContactForm() {
    await this.send('Contact')
  }
}

export default Email