import nodemailer from 'nodemailer'
import { IEmailProvider, EmailOptions, emailConfig } from './config'

export class MicrosoftProvider implements IEmailProvider {
  private transporter: nodemailer.Transporter

  constructor() {
    if (!emailConfig.microsoft) {
      throw new Error('Microsoft configuration is not provided')
    }

    this.transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        type: 'OAuth2',
        user: emailConfig.microsoft.user,
        clientId: emailConfig.microsoft.clientId,
        clientSecret: emailConfig.microsoft.clientSecret,
        refreshToken: emailConfig.microsoft.refreshToken,
        tenantId: emailConfig.microsoft.tenantId
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
      console.error('Failed to send email via Microsoft:', error)
      return false
    }
  }
} 