export interface AdminRole {
  id: string
  name: string
  description?: string
  permissions: string[]
  users: number
}

export interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
  lastLoginAt?: string
  lastLoginIp?: string
  failedLoginAttempts: number
  lockedUntil?: string
  createdAt: string
  updatedAt: string
}

export interface AdminPermission {
  id: string
  name: string
  description?: string
  resource: string
  action: string
  createdAt: string
  updatedAt: string
}

export interface AuditLogEntry {
  id: string
  entityType: string
  entityId: string
  action: string
  changes?: Record<string, any>
  performedBy?: string
  performedAt: string
  ipAddress?: string
} 