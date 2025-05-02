-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  last_login_ip VARCHAR(45),
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_roles table
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_permissions table
CREATE TABLE IF NOT EXISTS admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  resource VARCHAR(100) NOT NULL,
  action VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_role_permissions junction table
CREATE TABLE IF NOT EXISTS admin_role_permissions (
  role_id UUID REFERENCES admin_roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES admin_permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (role_id, permission_id)
);

-- Create admin_user_roles junction table
CREATE TABLE IF NOT EXISTS admin_user_roles (
  user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES admin_roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,
  changes JSONB,
  performed_by UUID REFERENCES admin_users(id),
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_performed_at ON audit_logs(performed_at);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_roles_name ON admin_roles(name);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_resource ON admin_permissions(resource);

-- Insert default roles
INSERT INTO admin_roles (name, description)
VALUES 
  ('super_admin', 'Super administrator with full system access'),
  ('admin', 'Administrator with limited system access')
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO admin_permissions (name, description, resource, action)
VALUES 
  ('view_dashboard', 'View admin dashboard', 'dashboard', 'view'),
  ('manage_users', 'Manage system users', 'users', 'manage'),
  ('manage_roles', 'Manage user roles', 'roles', 'manage'),
  ('view_audit_logs', 'View system audit logs', 'audit_logs', 'view'),
  ('manage_settings', 'Manage system settings', 'settings', 'manage'),
  ('manage_customers', 'Manage customer accounts', 'customers', 'manage'),
  ('view_reports', 'View system reports', 'reports', 'view'),
  ('manage_transactions', 'Manage transactions', 'transactions', 'manage')
ON CONFLICT (name) DO NOTHING;

-- Assign all permissions to super_admin role
INSERT INTO admin_role_permissions (role_id, permission_id)
SELECT 
  r.id as role_id,
  p.id as permission_id
FROM admin_roles r
CROSS JOIN admin_permissions p
WHERE r.name = 'super_admin'
ON CONFLICT DO NOTHING;

-- Assign basic permissions to admin role
INSERT INTO admin_role_permissions (role_id, permission_id)
SELECT 
  r.id as role_id,
  p.id as permission_id
FROM admin_roles r
CROSS JOIN admin_permissions p
WHERE r.name = 'admin'
  AND p.name IN ('view_dashboard', 'manage_customers', 'view_reports')
ON CONFLICT DO NOTHING; 