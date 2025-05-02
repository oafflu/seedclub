import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import * as React from 'react'
import type { ComponentType } from 'react'
import AdminPasswordResetEmail from '@/emails/AdminPasswordResetEmail'

export interface EmailOptions {
  to: string
  subject: string
  html?: string
  text?: string
  template?: string
  data?: Record<string, any>
}

interface EmailTemplates {
  'admin-password-reset': ComponentType<any>
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const templates: EmailTemplates = {
  'admin-password-reset': AdminPasswordResetEmail,
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  let html = options.html
  let text = options.text

  if (options.template && options.data) {
    const Template = templates[options.template as keyof EmailTemplates]
    if (!Template) {
      throw new Error(`Template ${options.template} not found`)
    }
    
    const element = React.createElement(Template, options.data)
    html = render(element)
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: options.to,
    subject: options.subject,
    html,
    text,
  })
} 