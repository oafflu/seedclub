-- Insert test admin user with bcrypt-hashed password 'test123'
INSERT INTO admin_users (
    email,
    encrypted_password,
    first_name,
    last_name,
    role,
    is_active
) VALUES (
    'test@admin.com',
    '$2a$10$xLJXBWWO8g/Y4xB4U3SOOOKkZYW.qY5VFwXqvxHEb.J4c7uKD9ZWu', -- hashed 'test123'
    'Test',
    'Admin',
    'admin',
    true
) ON CONFLICT (email) DO NOTHING; 