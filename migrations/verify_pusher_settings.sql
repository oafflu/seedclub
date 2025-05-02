-- Check table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'pusher_settings'
ORDER BY ordinal_position;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'pusher_settings';

-- Check policies
SELECT 
    polname as policy_name,
    polpermissive as permissive,
    polroles as roles,
    polcmd as command
FROM pg_policy
WHERE polrelid = 'public.pusher_settings'::regclass;

-- Check triggers
SELECT 
    tgname as trigger_name,
    tgenabled as enabled,
    tgtype as type
FROM pg_trigger
WHERE tgrelid = 'public.pusher_settings'::regclass;

-- Check default row
SELECT * FROM public.pusher_settings; 