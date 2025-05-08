import { supabase } from '@/lib/supabase/client'
import type { AdminUser, AdminRole, AdminPermission, AdminRolePermission, AdminUserRole, AuditLog } from '@/types/database'
import type { AdminRole as AdminRoleType } from '@/types/admin'
import { v4 as uuidv4 } from 'uuid'
import { hashPassword } from '@/lib/password'

interface RolePermissionResponse {
  permission: AdminPermission;
}

export const adminService = {
  // Users
  async getUsers(): Promise<AdminUser[]> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getUserById(id: string): Promise<AdminUser> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async createUser(userData: Partial<AdminUser>): Promise<AdminUser> {
    const { data, error } = await supabase
      .from('admin_users')
      .insert([userData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateUser(id: string, updates: Partial<AdminUser>): Promise<AdminUser> {
    const { data, error } = await supabase
      .from('admin_users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async updateUserRole(userId: string, roleId: string): Promise<void> {
    const { error: deleteError } = await supabase
      .from('admin_user_roles')
      .delete()
      .eq('user_id', userId)
    
    if (deleteError) throw deleteError

    const { error: insertError } = await supabase
      .from('admin_user_roles')
      .insert([{ user_id: userId, role_id: roleId }])
    
    if (insertError) throw insertError
  },

  // Roles
  async getRoles(): Promise<AdminRole[]> {
    const { data, error } = await supabase
      .from('admin_roles')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data
  },

  async getRoleById(id: string): Promise<AdminRole> {
    const { data, error } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async createRole(roleData: Partial<AdminRole>): Promise<AdminRole> {
    const { data, error } = await supabase
      .from('admin_roles')
      .insert([roleData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateRole(id: string, updates: Partial<AdminRole>): Promise<AdminRole> {
    const { data, error } = await supabase
      .from('admin_roles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteRole(id: string): Promise<void> {
    const { error } = await supabase
      .from('admin_roles')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Permissions
  async getPermissions(): Promise<AdminPermission[]> {
    const { data, error } = await supabase
      .from('admin_permissions')
      .select('*')
      .order('resource', { ascending: true })
      .order('name', { ascending: true })
    
    if (error) throw error
    return data
  },

  async getRolePermissions(roleId: string): Promise<AdminPermission[]> {
    const { data, error } = await supabase
      .from('admin_role_permissions')
      .select('permission:admin_permissions(*)')
      .eq('role_id', roleId)
    
    if (error) throw error
    // Some Supabase versions return permission as an array, so flatten if needed
    return ((data as unknown) as RolePermissionResponse[])
      .map(d => Array.isArray(d.permission) ? d.permission[0] : d.permission)
      .filter(Boolean)
  },

  async updateRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    const { error: deleteError } = await supabase
      .from('admin_role_permissions')
      .delete()
      .eq('role_id', roleId)
    
    if (deleteError) throw deleteError

    if (permissionIds.length > 0) {
      const { error: insertError } = await supabase
        .from('admin_role_permissions')
        .insert(permissionIds.map(permissionId => ({
          role_id: roleId,
          permission_id: permissionId
        })))
      
      if (insertError) throw insertError
    }
  },

  // Role Management
  async cloneRole(roleId: string, name: string, description: string): Promise<AdminRole> {
    // Get the role's permissions
    const { data: permissions, error: permissionsError } = await supabase
      .from('admin_role_permissions')
      .select('permission_id')
      .eq('role_id', roleId)

    if (permissionsError) {
      throw new Error('Failed to get role permissions')
    }

    // Create new role
    const { data: newRole, error: roleError } = await supabase
      .from('admin_roles')
      .insert([{ name, description }])
      .select()
      .single()

    if (roleError || !newRole) {
      throw new Error('Failed to create new role')
    }

    // Clone permissions for the new role
    if (permissions && permissions.length > 0) {
      const newPermissions = permissions.map((p: { permission_id: string }) => ({
        role_id: newRole.id,
        permission_id: p.permission_id
      }))

      const { error: cloneError } = await supabase
        .from('admin_role_permissions')
        .insert(newPermissions)

      if (cloneError) {
        // Rollback role creation if permission cloning fails
        await supabase
          .from('admin_roles')
          .delete()
          .eq('id', newRole.id)
        throw new Error('Failed to clone role permissions')
      }
    }

    return newRole as AdminRole
  },

  // Password Management
  async initiatePasswordReset(userId: string): Promise<void> {
    const user = await this.getUserById(userId)
    if (!user) throw new Error('User not found')

    const { error } = await supabase.auth.resetPasswordForEmail(user.email)
    if (error) throw error
  },

  // Audit Logs
  async createAuditLog(log: Partial<AuditLog>): Promise<void> {
    const { error } = await supabase
      .from('audit_logs')
      .insert([log])
    
    if (error) throw error
  },

  async getAuditLogs(entityType?: string, entityId?: string, limit = 50): Promise<AuditLog[]> {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('performed_at', { ascending: false })
      .limit(limit)

    if (entityType) {
      query = query.eq('entity_type', entityType)
    }

    if (entityId) {
      query = query.eq('entity_id', entityId)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  }
} 