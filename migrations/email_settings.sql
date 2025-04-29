-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create email settings table
CREATE TABLE IF NOT EXISTS email_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider VARCHAR(50) NOT NULL,
  active BOOLEAN DEFAULT true,
  from_email VARCHAR(255) NOT NULL,
  smtp_config JSONB,
  sendgrid_config JSONB,
  gmail_config JSONB,
  microsoft_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create unique constraint to ensure only one active configuration
CREATE UNIQUE INDEX IF NOT EXISTS idx_email_settings_single_row ON email_settings ((true));

-- Create trigger for updating the updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_email_settings_timestamp
    BEFORE UPDATE ON email_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_email_settings_timestamp(); 