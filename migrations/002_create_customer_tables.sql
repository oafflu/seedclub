-- Create customers table if it doesn't exist (in case it was created manually)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    encrypted_password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(100),
    verification_token_expires TIMESTAMP WITH TIME ZONE,
    reset_token VARCHAR(100),
    reset_token_expires TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip VARCHAR(45),
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer_profiles table
CREATE TABLE IF NOT EXISTS customer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID UNIQUE NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    date_of_birth DATE,
    tax_id VARCHAR(50),
    occupation VARCHAR(100),
    employer_name VARCHAR(100),
    annual_income DECIMAL(12,2),
    source_of_funds VARCHAR(50),
    notes TEXT,
    receive_marketing_emails BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create kyc_verifications table
CREATE TABLE IF NOT EXISTS kyc_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    document_number VARCHAR(100),
    document_front_url TEXT,
    document_back_url TEXT,
    selfie_url TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    rejection_reason TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wallets table
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID UNIQUE NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer_jars table
CREATE TABLE IF NOT EXISTS customer_jars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    jar_id UUID NOT NULL REFERENCES jars(id) ON DELETE RESTRICT,
    initial_amount DECIMAL(12,2) NOT NULL,
    current_value DECIMAL(12,2) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    maturity_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customer_profiles_customer_id ON customer_profiles(customer_id);
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_customer_id ON kyc_verifications(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_jars_customer_id ON customer_jars(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_jars_jar_id ON customer_jars(jar_id);

-- Create empty profiles for existing customers
INSERT INTO customer_profiles (customer_id)
SELECT id FROM customers
WHERE NOT EXISTS (
    SELECT 1 FROM customer_profiles WHERE customer_profiles.customer_id = customers.id
);

-- Create empty wallets for existing customers
INSERT INTO wallets (customer_id)
SELECT id FROM customers
WHERE NOT EXISTS (
    SELECT 1 FROM wallets WHERE wallets.customer_id = customers.id
); 