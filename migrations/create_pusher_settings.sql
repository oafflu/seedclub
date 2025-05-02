-- Function to create pusher_settings table
CREATE OR REPLACE FUNCTION create_pusher_settings_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Create the table if it doesn't exist
    CREATE TABLE IF NOT EXISTS pusher_settings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        enabled BOOLEAN DEFAULT true,
        app_id VARCHAR(255) NOT NULL,
        key VARCHAR(255) NOT NULL,
        secret VARCHAR(255) NOT NULL,
        cluster VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create the trigger if it doesn't exist
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    -- Drop the trigger if it exists
    DROP TRIGGER IF EXISTS update_pusher_settings_updated_at ON pusher_settings;

    -- Create the trigger
    CREATE TRIGGER update_pusher_settings_updated_at
        BEFORE UPDATE ON pusher_settings
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
END;
$$; 