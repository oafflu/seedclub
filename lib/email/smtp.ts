import nodemailer from 'nodemailer'
import { EmailProvider, EmailOptions, emailConfig } from './config'

export class SMTPEmailProvider implements EmailProvider {
  private transporter: nodemailer.Transporter

  constructor() {
    if (!emailConfig.smtp) {
      throw new Error('SMTP configuration is not provided')
    }

    this.transporter = nodemailer.createTransport({
      host: emailConfig.smtp.host,
      port: emailConfig.smtp.port,
      secure: emailConfig.smtp.secure,
      auth: {
        user: emailConfig.smtp.auth.user,
        pass: emailConfig.smtp.auth.pass
      }
    })
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: options.from || emailConfig.from,
        to: options.to,
        subject: options.subject,
        html: options.html
      })
      return true
    } catch (error) {
      console.error('Failed to send email via SMTP:', error)
      return false
    }
  }
} 