import { MarketingLayout } from "@/components/marketing-layout"

export default function TermsPage() {
  return (
    <MarketingLayout title="Terms of Service" description="Please read these terms carefully before using Seed Club.">
      <div className="prose prose-lg max-w-none">
        <p>Last Updated: March 31, 2025</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Seed Club's website, mobile application, or any services provided by Seed Club
          (collectively, the "Services"), you agree to be bound by these Terms of Service. If you do not agree to these
          terms, please do not use our Services.
        </p>

        <h2>2. Description of Services</h2>
        <p>
          Seed Club provides an investment platform that allows users to invest in time-bound investment jars with
          guaranteed returns. Our Services include but are not limited to account management, investment tracking, fund
          transfers, and educational resources related to investing.
        </p>

        <h2>3. Eligibility</h2>
        <p>
          To use our Services, you must be at least 18 years old and have the legal capacity to enter into a binding
          agreement. By using our Services, you represent and warrant that you meet these eligibility requirements.
        </p>

        <h2>4. Account Registration</h2>
        <p>
          To access certain features of our Services, you must register for an account. You agree to provide accurate,
          current, and complete information during the registration process and to update such information to keep it
          accurate, current, and complete.
        </p>
        <p>
          You are responsible for safeguarding your account credentials and for any activity that occurs under your
          account. You agree to notify Seed Club immediately of any unauthorized use of your account or any other breach
          of security.
        </p>

        <h2>5. Investment Terms</h2>
        <p>
          5.1. <strong>Investment Options:</strong> Seed Club offers various investment jars with different terms (12,
          24, or 36 months) and corresponding Annual Percentage Yield (APY) rates (10%, 12%, or 15%).
        </p>
        <p>
          5.2. <strong>Minimum Investment:</strong> The minimum investment amount for any jar is $100.
        </p>
        <p>
          5.3. <strong>Guaranteed Returns:</strong> Seed Club guarantees the stated APY for the full term of the
          investment, provided the investment remains in the jar until maturity.
        </p>
        <p>
          5.4. <strong>Early Withdrawal:</strong> Early withdrawals are subject to fees as outlined in our Fee Schedule.
          These fees may reduce the principal amount of your investment.
        </p>
        <p>
          5.5. <strong>Maturity:</strong> Upon maturity, the full amount (principal plus earned interest) will be
          transferred to your Seed Club wallet, from which you can withdraw to your bank account or reinvest.
        </p>

        <h2>6. Fees</h2>
        <p>
          Seed Club may charge fees for certain services as outlined in our Fee Schedule, which is incorporated into
          these Terms by reference. We reserve the right to modify our fees at any time with notice to users.
        </p>

        <h2>7. Privacy</h2>
        <p>
          Your privacy is important to us. Our Privacy Policy, which is incorporated into these Terms by reference,
          explains how we collect, use, and disclose information about you.
        </p>

        <h2>8. Intellectual Property</h2>
        <p>
          The Services and all content and materials included on or within the Services, including but not limited to
          text, graphics, logos, images, and software, are the property of Seed Club or its licensors and are protected
          by copyright, trademark, and other intellectual property laws.
        </p>

        <h2>9. Prohibited Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>
            Use the Services for any illegal purpose or in violation of any local, state, national, or international law
          </li>
          <li>
            Violate or encourage others to violate the rights of third parties, including intellectual property rights
          </li>
          <li>Attempt to gain unauthorized access to the Services or other users' accounts</li>
          <li>Interfere with the proper functioning of the Services</li>
          <li>Engage in any activity that could disable, overburden, or impair the Services</li>
          <li>Use automated means to access or use the Services</li>
        </ul>

        <h2>10. Disclaimer of Warranties</h2>
        <p>
          THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
          IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
          TITLE, AND NON-INFRINGEMENT.
        </p>

        <h2>11. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, SEED CLUB SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
          CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR
          INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR
          USE OF OR INABILITY TO ACCESS OR USE THE SERVICES.
        </p>

        <h2>12. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless Seed Club and its officers, directors, employees, agents,
          and representatives from and against any claims, liabilities, damages, losses, and expenses, including without
          limitation reasonable legal and accounting fees, arising out of or in any way connected with your access to or
          use of the Services or your violation of these Terms.
        </p>

        <h2>13. Termination</h2>
        <p>
          Seed Club may terminate or suspend your access to the Services at any time, with or without cause, and with or
          without notice. Upon termination, your right to use the Services will immediately cease.
        </p>

        <h2>14. Changes to Terms</h2>
        <p>
          We may modify these Terms at any time. If we make material changes to these Terms, we will notify you by email
          or by posting a notice on our website. Your continued use of the Services after such notification constitutes
          your acceptance of the modified Terms.
        </p>

        <h2>15. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the State of New York, without
          regard to its conflict of law provisions.
        </p>

        <h2>16. Dispute Resolution</h2>
        <p>
          Any dispute arising from or relating to these Terms or the Services shall be resolved through binding
          arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall be
          conducted in New York, New York.
        </p>

        <h2>17. Severability</h2>
        <p>
          If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or
          eliminated to the minimum extent necessary so that the Terms will otherwise remain in full force and effect
          and enforceable.
        </p>

        <h2>18. Entire Agreement</h2>
        <p>
          These Terms, together with the Privacy Policy and any other agreements expressly incorporated by reference
          herein, constitute the entire agreement between you and Seed Club concerning the Services.
        </p>

        <h2>19. Contact Information</h2>
        <p>If you have any questions about these Terms, please contact us at legal@seedclub.com.</p>
      </div>
    </MarketingLayout>
  )
}
