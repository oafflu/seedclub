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
/app
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
  /auth                 # Authentication
    /login              # Customer login
    /register           # Customer registration
    /forgot-password    # Password recovery
  /profile              # User profile
    /kyc-verification   # KYC verification
    /personal-info      # Personal information
    /contact-info       # Contact information
    /security           # Security settings
    /payment-methods    # Payment methods
  /wallet               # Wallet management
    /add-funds          # Add funds
  /withdraw             # Withdrawal
  /history              # Transaction history
  /referrals            # Referral program
  /invest               # Investment opportunities
  /dashboard            # User dashboard
  /support              # Customer support
  /faq                  # Frequently asked questions
  /about                # About page
  /careers              # Careers page
  /contact              # Contact page
  /blog                 # Blog
  /terms                # Terms and conditions
  /privacy              # Privacy policy
  /security             # Security information
/components             # Reusable components
/public                 # Static assets
  /images               # Image assets
  /fonts                # Font files
\`\`\`

## Technologies Used

- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with shadcn/ui design system
- **Icons**: Custom SVG icons and Lucide React
- **State Management**: React Hooks and Context API
- **Authentication**: Custom authentication system (can be integrated with Next Auth)
- **Forms**: React Hook Form (recommended for production)

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

## Troubleshooting

### Common Issues
1. **Page Not Found**: Check route configuration in `app` directory
2. **Styling Issues**: Ensure Tailwind classes are correctly applied
3. **Component Errors**: Check for missing props or incorrect imports

### Support
For additional support or questions, contact the development team.
