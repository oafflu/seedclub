import { MailDataRequired } from '@sendgrid/mail'

export type EmailProvider = 'smtp' | 'sendgrid' | 'gmail' | 'microsoft'

export interface EmailConfig {
  provider: EmailProvider
  active: boolean
  from: string
  smtp?: {
    host: string
    port: number
    secure: boolean
    auth: {
      user: string
      pass: string
    }
  }
  sendgrid?: {
    apiKey: string
  }
  gmail?: {
    clientId: string
    clientSecret: string
    refreshToken: string
    user: string
  }
  microsoft?: {
    clientId: string
    clientSecret: string
    refreshToken: string
    user: string
    tenantId: string
  }
}

// Default configuration from environment variables
export const emailConfig: EmailConfig = {
  provider: (process.env.EMAIL_PROVIDER as EmailProvider) || 'smtp',
  active: true,
  from: process.env.EMAIL_FROM || 'noreply@seedclub.com',
  smtp: process.env.SMTP_HOST ? {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || ''
    }
  } : undefined,
  sendgrid: process.env.SENDGRID_API_KEY ? {
    apiKey: process.env.SENDGRID_API_KEY
  } : undefined,
  gmail: process.env.GMAIL_CLIENT_ID ? {
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET || '',
    refreshToken: process.env.GMAIL_REFRESH_TOKEN || '',
    user: process.env.GMAIL_USER || ''
  } : undefined,
  microsoft: process.env.MICROSOFT_CLIENT_ID ? {
    clientId: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
    refreshToken: process.env.MICROSOFT_REFRESH_TOKEN || '',
    user: process.env.MICROSOFT_USER || '',
    tenantId: process.env.MICROSOFT_TENANT_ID || ''
  } : undefined
}

export interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

// Email provider interface
export interface IEmailProvider {
  sendEmail(options: EmailOptions): Promise<boolean>
} 