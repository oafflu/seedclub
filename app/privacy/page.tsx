import { MarketingLayout } from "@/components/marketing-layout"

export default function PrivacyPage() {
  return (
    <MarketingLayout
      title="Privacy Policy"
      description="Learn how Seed Club collects, uses, and protects your personal information."
    >
      <div className="prose prose-lg max-w-none">
        <p>Last Updated: March 31, 2025</p>

        <h2>1. Introduction</h2>
        <p>
          At Seed Club, we respect your privacy and are committed to protecting your personal information. This Privacy
          Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile
          application, or any services provided by Seed Club (collectively, the "Services").
        </p>
        <p>
          Please read this Privacy Policy carefully. By accessing or using our Services, you acknowledge that you have
          read, understood, and agree to be bound by this Privacy Policy.
        </p>

        <h2>2. Information We Collect</h2>
        <p>We collect several types of information from and about users of our Services:</p>
        <h3>2.1. Personal Information</h3>
        <p>Personal information is data that can be used to identify you individually. This may include:</p>
        <ul>
          <li>Contact information (name, email address, phone number, mailing address)</li>
          <li>Identification information (date of birth, Social Security Number, government ID)</li>
          <li>Financial information (bank account details, payment card information)</li>
          <li>Employment information</li>
          <li>Investment preferences and goals</li>
        </ul>

        <h3>2.2. Non-Personal Information</h3>
        <p>We also collect non-personal information that does not directly identify you, including:</p>
        <ul>
          <li>Device information (IP address, browser type, operating system)</li>
          <li>Usage data (pages visited, time spent on the Services, click-through data)</li>
          <li>Location data (general geographic location based on IP address)</li>
        </ul>

        <h2>3. How We Collect Information</h2>
        <p>We collect information in several ways:</p>
        <ul>
          <li>
            Directly from you when you provide it to us (e.g., when you register for an account, complete forms, or
            communicate with us)
          </li>
          <li>
            Automatically as you navigate through our Services (using cookies, web beacons, and similar technologies)
          </li>
          <li>
            From third parties, such as identity verification services, credit bureaus, and financial institutions
          </li>
        </ul>

        <h2>4. How We Use Your Information</h2>
        <p>We use the information we collect for various purposes, including:</p>
        <ul>
          <li>Providing, maintaining, and improving our Services</li>
          <li>Processing transactions and managing your account</li>
          <li>Verifying your identity and preventing fraud</li>
          <li>Communicating with you about your account, our Services, and promotional offers</li>
          <li>Responding to your inquiries and providing customer support</li>
          <li>Complying with legal and regulatory requirements</li>
          <li>Analyzing usage patterns to enhance user experience</li>
          <li>
            Protecting our rights, property, and safety, and the rights, property, and safety of our users or others
          </li>
        </ul>

        <h2>5. Disclosure of Your Information</h2>
        <p>We may disclose your personal information in the following circumstances:</p>
        <ul>
          <li>To our subsidiaries and affiliates</li>
          <li>To contractors, service providers, and other third parties we use to support our business</li>
          <li>
            To a buyer or other successor in the event of a merger, divestiture, restructuring, reorganization,
            dissolution, or other sale or transfer of some or all of Seed Club's assets
          </li>
          <li>
            To comply with any court order, law, or legal process, including to respond to any government or regulatory
            request
          </li>
          <li>To enforce our Terms of Service or other agreements</li>
          <li>
            If we believe disclosure is necessary or appropriate to protect the rights, property, or safety of Seed
            Club, our users, or others
          </li>
        </ul>
        <p>We do not sell, rent, or lease your personal information to third parties.</p>

        <h2>6. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect the security, confidentiality, and
          integrity of your personal information. However, no method of transmission over the Internet or electronic
          storage is 100% secure, so we cannot guarantee absolute security.
        </p>

        <h2>7. Your Privacy Rights</h2>
        <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
        <ul>
          <li>The right to access and receive a copy of your personal information</li>
          <li>The right to correct inaccurate or incomplete information</li>
          <li>The right to delete your personal information under certain circumstances</li>
          <li>The right to restrict or object to the processing of your personal information</li>
          <li>The right to data portability</li>
        </ul>
        <p>
          To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
        </p>

        <h2>8. Children's Privacy</h2>
        <p>
          Our Services are not intended for children under 18 years of age. We do not knowingly collect personal
          information from children under 18. If you are a parent or guardian and believe that your child has provided
          us with personal information, please contact us immediately.
        </p>

        <h2>9. Cookies and Similar Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to track activity on our Services and to hold certain
          information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          However, if you do not accept cookies, you may not be able to use some portions of our Services.
        </p>

        <h2>10. Third-Party Links</h2>
        <p>
          Our Services may contain links to third-party websites or services that are not owned or controlled by Seed
          Club. We have no control over and assume no responsibility for the content, privacy policies, or practices of
          any third-party websites or services.
        </p>

        <h2>11. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
          Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy
          Policy periodically for any changes.
        </p>

        <h2>12. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <p>
          Email: privacy@seedclub.com
          <br />
          Address: 123 Financial District, New York, NY 10004, United States
          <br />
          Phone: 1-800-555-1234
        </p>
      </div>
    </MarketingLayout>
  )
}
