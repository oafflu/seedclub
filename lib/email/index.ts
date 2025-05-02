import { EmailConfig, EmailOptions } from './config'

// Placeholder configuration - email functionality disabled
export const emailConfig: EmailConfig = {
  provider: 'smtp',
  active: false,
  from: 'noreply@seedclub.com'
}

// Placeholder function for future implementation
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  console.log('Email sending is disabled')
  return true
} 