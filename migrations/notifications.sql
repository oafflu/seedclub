-- Alter notifications table to add new columns
ALTER TABLE notifications
    ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'medium',
    ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE;

-- Rename columns (must be done separately)
ALTER TABLE notifications RENAME COLUMN user_id TO recipient_id;
ALTER TABLE notifications RENAME COLUMN is_read TO read;

-- Add foreign key if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'notifications_recipient_id_fkey'
    ) THEN
        ALTER TABLE notifications
            ADD CONSTRAINT notifications_recipient_id_fkey 
            FOREIGN KEY (recipient_id) 
            REFERENCES admin_users(id) 
            ON DELETE CASCADE;
    END IF;
END $$;

-- Create notification_settings table
CREATE TABLE IF NOT EXISTS notification_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    email_notifications JSONB DEFAULT '{
        "customer_registrations": true,
        "large_deposits": true,
        "large_withdrawals": true,
        "new_support_tickets": true,
        "welcome_email": true,
        "deposit_confirmation": true,
        "withdrawal_confirmation": true,
        "interest_payment": true,
        "jar_maturity": true
    }'::jsonb,
    sms_notifications JSONB DEFAULT '{
        "enabled": false,
        "security_alerts": true,
        "transaction_confirmations": true,
        "marketing_messages": false
    }'::jsonb,
    push_notifications JSONB DEFAULT '{
        "enabled": true
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for notification_settings
CREATE TRIGGER update_notification_settings_updated_at
    BEFORE UPDATE ON notification_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Drop existing RLS policies if they exist
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view their own notification settings" ON notification_settings;
DROP POLICY IF EXISTS "Users can update their own notification settings" ON notification_settings;

-- Grant appropriate permissions
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT
    TO authenticated
    USING (recipient_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE
    TO authenticated
    USING (recipient_id = auth.uid());

-- Create policies for notification settings
CREATE POLICY "Users can view their own notification settings" ON notification_settings
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notification settings" ON notification_settings
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid()); 