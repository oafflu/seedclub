-- Make encrypted_password nullable in admin_users table
ALTER TABLE admin_users 
ALTER COLUMN encrypted_password DROP NOT NULL;

-- Update existing records where encrypted_password is required but not used
UPDATE admin_users
SET encrypted_password = NULL
WHERE encrypted_password = ''; 