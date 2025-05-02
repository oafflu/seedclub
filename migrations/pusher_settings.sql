-- Create pusher_settings table
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

-- Create trigger for pusher_settings
CREATE TRIGGER update_pusher_settings_updated_at
    BEFORE UPDATE ON pusher_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 