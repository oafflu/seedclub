import { MarketingLayout } from "@/components/marketing-layout"
import { Shield, Lock, AlertTriangle, CheckCircle, Fingerprint, Server, Mail, Phone } from "lucide-react"

export default function SecurityPage() {
  return (
    <MarketingLayout title="Security" description="Learn how Seed Club protects your account and personal information.">
      <div className="space-y-12">
        <section>
          <p className="text-lg text-muted-foreground mb-8">
            At Seed Club, the security of your account and personal information is our top priority. We employ
            industry-leading security measures and best practices to ensure that your data and investments are protected
            at all times.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-muted/30 p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Data Encryption</h2>
              </div>
              <p className="text-muted-foreground">
                We use 256-bit encryption to protect all sensitive data transmitted between your device and our servers.
                This is the same level of encryption used by major financial institutions worldwide.
              </p>
            </div>

            <div className="bg-muted/30 p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Fingerprint className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Multi-Factor Authentication</h2>
              </div>
              <p className="text-muted-foreground">
                We offer multi-factor authentication options, including biometric verification, SMS codes, and
                authenticator apps, to add an extra layer of security to your account.
              </p>
            </div>

            <div className="bg-muted/30 p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Server className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Secure Infrastructure</h2>
              </div>
              <p className="text-muted-foreground">
                Our systems are hosted in secure, SOC 2 compliant data centers with 24/7 monitoring, redundant power
                systems, and advanced physical security measures.
              </p>
            </div>

            <div className="bg-muted/30 p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Fraud Protection</h2>
              </div>
              <p className="text-muted-foreground">
                We employ advanced fraud detection systems that monitor for suspicious activities and unauthorized
                access attempts to protect your account and investments.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Our Security Practices</h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold">Regular Security Audits</h3>
                <p className="text-muted-foreground">
                  We conduct regular security audits and penetration testing by independent third-party security firms
                  to identify and address potential vulnerabilities.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold">Employee Security Training</h3>
                <p className="text-muted-foreground">
                  All Seed Club employees undergo comprehensive security training and follow strict protocols when
                  handling customer data.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold">Secure Development Practices</h3>
                <p className="text-muted-foreground">
                  Our development team follows secure coding practices and conducts thorough code reviews to ensure that
                  our applications are built with security in mind.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold">Compliance with Industry Standards</h3>
                <p className="text-muted-foreground">
                  We comply with industry security standards and regulations, including PCI DSS for payment processing
                  and relevant financial regulations.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Protecting Your Account</h2>

          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mb-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-yellow-800">Important Security Tips</h3>
                <p className="text-yellow-700">
                  While we implement robust security measures on our end, your actions also play a crucial role in
                  keeping your account secure. Please follow these security best practices:
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border p-5 rounded-lg">
              <h3 className="font-bold mb-3">Use Strong, Unique Passwords</h3>
              <p className="text-sm text-muted-foreground">
                Create a strong, unique password for your Seed Club account that includes a mix of uppercase and
                lowercase letters, numbers, and special characters. Avoid using the same password across multiple
                websites.
              </p>
            </div>

            <div className="border p-5 rounded-lg">
              <h3 className="font-bold mb-3">Enable Multi-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account by enabling multi-factor authentication in your account
                settings.
              </p>
            </div>

            <div className="border p-5 rounded-lg">
              <h3 className="font-bold mb-3">Be Wary of Phishing Attempts</h3>
              <p className="text-sm text-muted-foreground">
                Be cautious of emails, calls, or messages claiming to be from Seed Club that ask for your password or
                personal information. We will never ask for your password or full Social Security Number.
              </p>
            </div>

            <div className="border p-5 rounded-lg">
              <h3 className="font-bold mb-3">Keep Your Devices Secure</h3>
              <p className="text-sm text-muted-foreground">
                Ensure your devices have up-to-date antivirus software and operating systems. Lock your devices when not
                in use and avoid using public Wi-Fi for accessing your Seed Club account.
              </p>
            </div>

            <div className="border p-5 rounded-lg">
              <h3 className="font-bold mb-3">Monitor Your Account Regularly</h3>
              <p className="text-sm text-muted-foreground">
                Regularly review your account activity and transaction history. Report any suspicious activities
                immediately to our security team.
              </p>
            </div>

            <div className="border p-5 rounded-lg">
              <h3 className="font-bold mb-3">Log Out When Finished</h3>
              <p className="text-sm text-muted-foreground">
                Always log out of your account when you're finished, especially when using shared or public computers.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-primary/10 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Report Security Concerns</h2>
          <p className="text-lg mb-6">
            If you notice any suspicious activity on your account or have security concerns, please contact our security
            team immediately:
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <span>security@seedclub.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              <span>1-800-555-9876 (Security Hotline)</span>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  )
}
