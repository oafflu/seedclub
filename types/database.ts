export interface AdminUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
  is_active: boolean;
  last_login_at?: string;
  last_login_ip?: string;
  failed_login_attempts: number;
  locked_until?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminRole {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminPermission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  created_at: string;
  updated_at: string;
}

export interface AdminRolePermission {
  role_id: string;
  permission_id: string;
  created_at: string;
}

export interface AdminUserRole {
  user_id: string;
  role_id: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  changes?: Record<string, any>;
  performed_by?: string;
  performed_at: string;
  ip_address?: string;
}

export interface RolePermissionResponse {
  permission: AdminPermission;
} 