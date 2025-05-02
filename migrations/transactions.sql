-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Safely drop existing objects if they exist
DO $$ 
BEGIN
    -- Drop triggers if they exist
    DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
    DROP TRIGGER IF EXISTS update_customer_jars_updated_at ON customer_jars;
    DROP TRIGGER IF EXISTS update_users_updated_at ON users;
    DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
    DROP TRIGGER IF EXISTS update_jars_updated_at ON jars;
    DROP TRIGGER IF EXISTS log_transaction_changes ON transactions;
EXCEPTION
    WHEN undefined_table THEN 
        -- Do nothing, tables don't exist yet
END $$;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS log_transaction_history() CASCADE;

-- Drop existing indexes if they exist
DO $$
BEGIN
    DROP INDEX IF EXISTS idx_transactions_customer_id;
    DROP INDEX IF EXISTS idx_transactions_jar_id;
    DROP INDEX IF EXISTS idx_transactions_status;
    DROP INDEX IF EXISTS idx_transactions_type;
    DROP INDEX IF EXISTS idx_transactions_created_at;
    DROP INDEX IF EXISTS idx_customer_jars_customer_id;
    DROP INDEX IF EXISTS idx_customer_jars_jar_id;
    DROP INDEX IF EXISTS idx_transaction_documents_transaction_id;
    DROP INDEX IF EXISTS idx_transaction_history_transaction_id;
EXCEPTION
    WHEN undefined_table THEN 
        -- Do nothing, tables don't exist yet
END $$;

-- Drop existing tables if they exist
DO $$
BEGIN
    -- Drop tables in correct order
    DROP TABLE IF EXISTS transaction_history CASCADE;
    DROP TABLE IF EXISTS transaction_documents CASCADE;
    DROP TABLE IF EXISTS customer_jars CASCADE;
    DROP TABLE IF EXISTS transactions CASCADE;
    DROP TABLE IF EXISTS jars CASCADE;
    DROP TABLE IF EXISTS customers CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
EXCEPTION
    WHEN undefined_table THEN 
        -- Do nothing, tables don't exist yet
END $$;

-- Create base tables
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'staff')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  minimum_investment DECIMAL(12,2) NOT NULL CHECK (minimum_investment > 0),
  maximum_investment DECIMAL(12,2) CHECK (maximum_investment > minimum_investment),
  term_months INTEGER NOT NULL CHECK (term_months > 0),
  interest_rate DECIMAL(5,2) NOT NULL CHECK (interest_rate >= 0),
  early_withdrawal_penalty DECIMAL(5,2) CHECK (early_withdrawal_penalty >= 0),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create dependent tables
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  jar_id UUID NOT NULL REFERENCES jars(id),
  type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'interest')),
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  description TEXT,
  method VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rejected')),
  notes TEXT,
  rejection_reason TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  processed_by UUID REFERENCES users(id),
  processed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS customer_jars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  jar_id UUID NOT NULL REFERENCES jars(id),
  balance DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(customer_id, jar_id)
);

CREATE TABLE IF NOT EXISTS transaction_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type VARCHAR(50),
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transaction_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  action VARCHAR(100) NOT NULL,
  performed_by UUID REFERENCES users(id),
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  details JSONB
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_jar_id ON transactions(jar_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_customer_jars_customer_id ON customer_jars(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_jars_jar_id ON customer_jars(jar_id);

CREATE INDEX IF NOT EXISTS idx_transaction_documents_transaction_id ON transaction_documents(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transaction_history_transaction_id ON transaction_history(transaction_id);

-- Create functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION log_transaction_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO transaction_history (
    transaction_id,
    action,
    performed_by,
    details
  ) VALUES (
    NEW.id,
    CASE
      WHEN TG_OP = 'INSERT' THEN 'created'
      WHEN TG_OP = 'UPDATE' AND NEW.status != OLD.status THEN 'status_changed'
      ELSE 'updated'
    END,
    COALESCE(NEW.updated_by, NEW.created_by),
    jsonb_build_object(
      'old_status', CASE WHEN TG_OP = 'UPDATE' THEN OLD.status ELSE NULL END,
      'new_status', NEW.status,
      'amount', NEW.amount,
      'type', NEW.type,
      'method', NEW.method
    )
  );
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_jars_updated_at
  BEFORE UPDATE ON customer_jars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER log_transaction_changes
  AFTER INSERT OR UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION log_transaction_history();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jars_updated_at
  BEFORE UPDATE ON jars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 