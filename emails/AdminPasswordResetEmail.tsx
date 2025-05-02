import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components'

interface AdminPasswordResetEmailProps {
  resetLink: string
  name: string
  expiresIn: string
}

export default function AdminPasswordResetEmail({
  resetLink,
  name,
  expiresIn,
}: AdminPasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your admin password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Password Reset Request</Heading>
          <Text style={text}>Hello {name},</Text>
          <Text style={text}>
            We received a request to reset your admin password. Click the button below
            to set a new password. This link will expire in {expiresIn}.
          </Text>
          <Link href={resetLink} style={button}>
            Reset Password
          </Link>
          <Text style={text}>
            If you didn't request this, you can safely ignore this email.
          </Text>
          <Text style={footer}>
            This is an automated message, please don't reply to this email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.25',
  marginBottom: '24px',
  textAlign: 'center' as const,
}

const text = {
  color: '#444',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '20px',
}

const button = {
  backgroundColor: '#000',
  borderRadius: '4px',
  color: '#fff',
  display: 'block',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '100%',
  marginBottom: '24px',
  padding: '16px',
  textAlign: 'center' as const,
  textDecoration: 'none',
  width: '100%',
}

const footer = {
  color: '#898989',
  fontSize: '14px',
  lineHeight: '22px',
  marginTop: '32px',
  textAlign: 'center' as const,
} 