import * as React from "react"
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface CustomerNotificationEmailProps {
  firstName: string
  lastName: string
}

export const CustomerNotificationEmail = ({
  firstName,
  lastName,
}: CustomerNotificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Message from Seed Club</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Heading style={h1}>Hello {firstName} {lastName},</Heading>
            <Text style={text}>
              Thank you for being a valued member of Seed Club. We wanted to reach out to you with an important update about your account.
            </Text>
            <Text style={text}>
              If you have any questions or concerns, please don't hesitate to contact our support team.
            </Text>
            <Text style={text}>
              Best regards,<br />
              The Seed Club Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
}

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0 0",
}

const text = {
  color: "#555",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
}

export default CustomerNotificationEmail 