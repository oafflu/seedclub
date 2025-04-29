import { EmailOptions, emailConfig } from './config'
import { SMTPEmailProvider } from './smtp'
import { SendGridEmailProvider } from './sendgrid'

class EmailService {
  private static instance: EmailService
  private provider: SMTPEmailProvider | SendGridEmailProvider

  private constructor() {
    if (emailConfig.provider === 'sendgrid') {
      this.provider = new SendGridEmailProvider()
    } else {
      this.provider = new SMTPEmailProvider()
    }
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    return this.provider.sendEmail(options)
  }

  async sendVerificationEmail(email: string, token: string): Promise<boolean> {
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`
    
    return this.sendEmail({
      to: email,
      subject: 'Verify your email address',
      html: `
        <h1>Welcome to Seed Club!</h1>
        <p>Please click the link below to verify your email address:</p>
        <p><a href="${verificationLink}">${verificationLink}</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account with us, please ignore this email.</p>
      `
    })
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`
    
    return this.sendEmail({
      to: email,
      subject: 'Reset your password',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested to reset your password. Click the link below to create a new password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
      `
    })
  }
}

// Export singleton instance methods
export const { sendEmail, sendVerificationEmail, sendPasswordResetEmail } = EmailService.getInstance() 