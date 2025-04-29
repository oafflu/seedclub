import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import { IEmailProvider, EmailOptions, emailConfig } from './config'

export class GmailProvider implements IEmailProvider {
  private transporter: nodemailer.Transporter

  constructor() {
    if (!emailConfig.gmail) {
      throw new Error('Gmail configuration is not provided')
    }

    const oauth2Client = new google.auth.OAuth2(
      emailConfig.gmail.clientId,
      emailConfig.gmail.clientSecret,
      'https://developers.google.com/oauthplayground'
    )

    oauth2Client.setCredentials({
      refresh_token: emailConfig.gmail.refreshToken
    })

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: emailConfig.gmail.user,
        clientId: emailConfig.gmail.clientId,
        clientSecret: emailConfig.gmail.clientSecret,
        refreshToken: emailConfig.gmail.refreshToken
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
      console.error('Failed to send email via Gmail:', error)
      return false
    }
  }
} 