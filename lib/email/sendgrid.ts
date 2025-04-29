import sgMail from '@sendgrid/mail'
import { EmailProvider, EmailOptions, emailConfig } from './config'

export class SendGridEmailProvider implements EmailProvider {
  constructor() {
    if (!emailConfig.sendgrid?.apiKey) {
      throw new Error('SendGrid API key is not provided')
    }
    sgMail.setApiKey(emailConfig.sendgrid.apiKey)
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      await sgMail.send({
        to: options.to,
        from: options.from || emailConfig.from,
        subject: options.subject,
        html: options.html
      })
      return true
    } catch (error) {
      console.error('Failed to send email via SendGrid:', error)
      return false
    }
  }
} 