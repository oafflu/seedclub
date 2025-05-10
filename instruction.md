# Seed Club Application - Instructions

## Project Overview

Seed Club is a comprehensive financial management platform that enables users to invest, track their earnings, refer friends, and manage their finances. The application features both user-facing and admin interfaces with distinct functionalities.

## Setup Instructions

1. **Clone the Repository**
   \`\`\`bash
   git clone <repository-url>
   cd seed-club
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Build for Production**
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

## Key Features

### Customer Features
- **Dashboard**: Overview of investments, profit, and recent activities
- **Invest**: Browse and invest in different jars
- **Wallet**: Manage funds, make deposits and withdrawals
- **History**: Track transaction history
- **Referrals**: Refer friends and earn rewards
- **Profile**: Manage personal information, security settings, and KYC verification

### Admin Features
- **Dashboard**: Overview of platform metrics
- **Customer Management**: View and manage user accounts
- **Jar Management**: Create, edit, and manage investment jars
- **Transaction Management**: Monitor and manage transactions
- **Wallet Management**: Manage platform funds
- **Referral Management**: Track and manage referral activities
- **Support**: Handle customer support tickets
- **Marketing**: Manage marketing content and campaigns
- **Settings**: Configure platform settings
- **User Roles**: Manage admin roles and permissions
- **Audit Logs**: Track administrative actions
- **System Monitoring**: Monitor platform performance

## Project Structure

\`\`\`
/app                    # Root directory (Marketing pages)
  /about                # About page
  /careers              # Careers page
  /contact              # Contact page
  /blog                 # Blog
  /faq                  # Frequently asked questions
  /terms                # Terms and conditions
  /privacy              # Privacy policy
  /security             # Security information
  /support-center       # Support center
  /mobile               # Customer-facing app (Main dashboard)
    /dashboard          # User dashboard
    /invest             # Investment opportunities
    /wallet             # Wallet management
      /add-funds        # Add funds
    /withdraw           # Withdrawal
    /history            # Transaction history
    /referrals          # Referral program
    /profile            # User profile
      /kyc-verification # KYC verification
      /personal-info    # Personal information
      /contact-info    # Contact information
      /security         # Security settings
      /payment-methods  # Payment methods
    /support            # Customer support
    /notifications      # User notifications
  /auth                 # Authentication
    /login              # Customer login
    /register           # Customer registration
    /forgot-password    # Password recovery
  /admin                # Admin interface
    /customers          # Customer management
    /jars               # Jar management
    /transactions       # Transaction management
    /wallet             # Wallet management
    /referrals          # Referral management
    /support            # Support management
    /settings           # Platform settings
    /users-roles        # Admin user management
    /audit-logs         # Admin action logs
    /system-monitoring  # System performance
    /marketing          # Marketing management
    /reports            # Financial reports
    /login              # Admin login
    /profile            # Admin profile
    /notifications      # Admin notifications
/components             # Reusable components
/public                 # Static assets
  /images               # Image assets
  /fonts                # Font files
\`\`\`

## Database Schema

The Seed Club application uses a PostgreSQL database with the following schema:

### Authentication & Users

#### Admin Users
- `admin_users`: Stores admin user accounts and credentials
- `admin_roles`: Defines roles for admin users
- `admin_permissions`: Defines permissions for admin roles
- `admin_role_permissions`: Junction table linking roles to permissions
- `admin_user_roles`: Junction table linking users to roles
- `audit_logs`: Tracks all admin actions for accountability

#### Customers
- `customers`: Stores customer accounts and personal information
- `kyc_verifications`: Stores KYC verification documents and status

### Financial Data

#### Investment Products
- `jars`: Defines investment products with terms and rates
- `customer_jars`: Tracks individual customer investments
- `wallets`: Manages customer wallet balances
- `payment_methods`: Stores customer payment methods
- `transactions`: Records all financial transactions
- `interest_accruals`: Tracks interest earned on investments

### Marketing & Content

#### Website Content
- `marketing_pages`: Stores content for marketing pages
- `marketing_components`: Stores reusable marketing components
- `faq_categories`: Organizes FAQs by category
- `faqs`: Stores frequently asked questions and answers

#### Blog
- `blog_categories`: Organizes blog posts by category
- `blog_posts`: Stores blog articles
- `blog_tags`: Stores tags for blog posts
- `blog_post_tags`: Junction table linking posts to tags

### Support & Communication

#### Customer Support
- `support_tickets`: Tracks customer support requests
- `support_messages`: Stores messages within support tickets
- `notifications`: Manages notifications for users and admins

### Referral System

#### Referrals
- `referral_campaigns`: Defines referral programs and rewards
- `referrals`: Tracks customer referrals and rewards

### System Monitoring

#### Performance Metrics
- `system_metrics`: Records system performance metrics
- `system_alerts`: Tracks system alerts and issues

## Authentication Flow

### Customer Authentication
1. Users can sign up through the registration page
2. Login via email and password
3. Password recovery through email
4. Session management with JWT (implemented in production)

### Admin Authentication
1. Separate login page for administrators
2. Enhanced security with role-based access control
3. Audit logging for administrative actions

## Customization

### Styling
- The application uses Tailwind CSS for styling
- Primary colors can be adjusted in the `tailwind.config.ts` file
- Component styles are defined in their respective files

### Icons
- Custom SVG icons are used for the mobile navigation
- Additional icons can be added to the respective icon component files
- Lucide React icons are used for UI elements

## Deployment Instructions

1. **Build the Application**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Deploy to Vercel**
   \`\`\`bash
   vercel
   \`\`\`

   Or configure automatic deployments via GitHub integration

3. **Environment Variables**
   - Set up environment variables for production
   - Include API keys, database connections, and authentication secrets

## Development Guidelines

### Adding New Features
1. Create components in the `/components` directory
2. Add pages in the appropriate `/app` directory
3. Update navigation in relevant files

### Page Organization
1. **Marketing Pages**: Place directly in the root `/app` directory
2. **Customer Pages**: Place in the `/app/mobile` directory
3. **Authentication Pages**: Place in the `/app/auth` directory
4. **Admin Pages**: Place in the `/app/admin` directory

### Styling Conventions
1. Use Tailwind CSS classes for styling
2. Follow the established color scheme
3. Ensure mobile responsiveness

### Best Practices
1. Keep components small and focused
2. Follow the Next.js App Router conventions
3. Use server components where possible
4. Client components should be marked with 'use client' directive
5. Format monetary values with commas for better readability
6. Authentication checks should be implemented in protected routes
7. Marketing pages should be accessible without authentication

## Specific Component Notes

### Mobile Navigation
The mobile navigation uses custom SVG icons for:
- Dashboard
- Invest
- Wallet
- Referrals
- Profile

These icons maintain their original styling and colors.

### Profit Calculator
The profit calculator on the dashboard simulates investment growth based on:
- Initial investment amount
- Growth percentage
- Term length
- Progress (time elapsed)

### Admin Marketing Management
The marketing management system allows administrators to:
- Edit marketing pages
- Manage marketing components
- Update promotional content

## Layouts

### Marketing Layout
- Used for all marketing pages in the root directory
- Includes header, footer, and marketing-specific components

### Mobile Layout
- Used for all customer-facing pages in the /mobile directory
- Includes mobile navigation, header, and customer-specific components

### Admin Layout
- Used for all admin pages in the /admin directory
- Includes admin navigation, header, and admin-specific components

## Troubleshooting

### Common Issues
1. **Page Not Found**: Check route configuration in `app` directory
2. **Styling Issues**: Ensure Tailwind classes are correctly applied
3. **Component Errors**: Check for missing props or incorrect imports
4. **Authentication Issues**: Verify authentication flow and protected routes

### Support
For additional support or questions, contact the development team.

# Project Completion Under Tight Deadline: Pragmatic Approach

## Context
Due to unresolved Supabase Auth/RLS issues blocking customer registration and login, the following approach was adopted to ensure the project could be completed and demoed on time.

---

## Steps Taken

1. **Bypass Customer Authentication**
   - Authentication checks and redirects are temporarily disabled in the mobile layout and customer-facing pages.
   - This allows all customer features to be developed, tested, and demoed without being blocked by Supabase Auth issues.

2. **Use Mock/Hardcoded Customer Data**
   - Where pages expect a logged-in customer, mock data or a hardcoded customer ID is used for development and testing.
   - This ensures all flows (profile, KYC, investments, support, etc.) can be completed and demoed.

3. **Focus on Core Features and UI/UX**
   - Priority is given to finishing and polishing all main features:
     - Customer dashboard, jars, wallet, profile, KYC, support, referrals, notifications, etc.
     - Admin features: customer management, KYC review, etc.
   - All navigation, forms, and data flows are made to work smoothly, even if some data is mocked.

4. **Document the Auth Issue and Workaround**
   - This section serves as documentation for why authentication is disabled.
   - Instructions are provided for what needs to be re-enabled/fixed once Supabase resolves the RLS/Auth issue.
   - Temporary workarounds in the code are clearly marked.

5. **Prepare for Quick Auth Re-Enable**
   - Original auth logic is kept commented out, so it can be quickly restored if the Supabase issue is resolved.
   - If a fix is provided, auth can be re-enabled and tested in minutes.

6. **Communicate Clearly with Stakeholders**
   - Team/client is informed that all features are complete and demoable, but customer registration/login is temporarily bypassed due to a Supabase platform issue.
   - Support ticket and troubleshooting steps are provided as proof of due diligence.

---

## Summary Table

| Step                        | Action/Status                | Goal/Benefit                        |
|-----------------------------|------------------------------|-------------------------------------|
| Disable customer auth       | ✅ Already done              | Unblocks all development            |
| Use mock/hardcoded data     | As needed                    | Allows all features to work         |
| Finish all features         | Focus for next 2 days        | Complete, test, and polish product  |
| Document workaround         | In README/handoff            | Transparency for future devs        |
| Prepare for quick re-enable | Keep auth code commented     | Fast fix if Supabase responds       |
| Communicate status          | To team/client               | Sets expectations, shows diligence  |

---

**Note:**
- Once Supabase resolves the Auth/RLS issue, re-enable authentication and remove mock data as appropriate.
- This approach ensures the project can be delivered on time, with a clear path to restoring full functionality later.
