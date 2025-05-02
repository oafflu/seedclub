-- Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    first_name TEXT,
    last_name TEXT,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    failed_login_attempts INTEGER DEFAULT 0,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create RLS policies
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Allow admins to view all records
CREATE POLICY "Admins can view all records"
    ON public.admins
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admins a
            WHERE a.id = auth.uid()
            AND (a.role = 'admin' OR a.role = 'super_admin')
        )
    );

-- Allow super_admins to insert/update/delete
CREATE POLICY "Super admins can manage all records"
    ON public.admins
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admins a
            WHERE a.id = auth.uid()
            AND a.role = 'super_admin'
        )
    );

-- Insert initial super admin user (replace with your admin user's UUID)
INSERT INTO public.admins (id, first_name, last_name, email, role, is_active)
SELECT 
    id,
    COALESCE(raw_user_meta_data->>'first_name', 'Admin') as first_name,
    COALESCE(raw_user_meta_data->>'last_name', 'User') as last_name,
    email,
    'super_admin' as role,
    true as is_active
FROM auth.users
WHERE email = 'admin@seedclub.com'
ON CONFLICT (id) DO UPDATE
SET role = 'super_admin',
    is_active = true; 