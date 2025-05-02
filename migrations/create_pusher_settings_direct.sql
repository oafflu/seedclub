-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the table first
CREATE TABLE IF NOT EXISTS public.pusher_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enabled BOOLEAN DEFAULT true,
    app_id VARCHAR(255) NOT NULL,
    key VARCHAR(255) NOT NULL,
    secret VARCHAR(255) NOT NULL,
    cluster VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Now that the table exists, we can drop the trigger if it exists
DROP TRIGGER IF EXISTS update_pusher_settings_updated_at ON public.pusher_settings;

-- Drop existing function (if exists)
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Create the updated_at trigger function in public schema
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER update_pusher_settings_updated_at
    BEFORE UPDATE ON public.pusher_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Grant appropriate permissions
ALTER TABLE public.pusher_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON public.pusher_settings;
DROP POLICY IF EXISTS "Enable write access for authenticated users only" ON public.pusher_settings;

-- Create policies
CREATE POLICY "Enable read access for authenticated users only" ON public.pusher_settings
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable write access for authenticated users only" ON public.pusher_settings
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Insert default settings if table is empty
INSERT INTO public.pusher_settings (app_id, key, secret, cluster)
SELECT '', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM public.pusher_settings); 