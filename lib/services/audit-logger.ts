import { supabaseAdmin } from "@/lib/supabase/client"

export type AuditAction = "create" | "update" | "delete" | "activate" | "deactivate"

export interface AuditLogEntry {
  entity_type: string
  entity_id: string
  action: AuditAction
  changes?: Record<string, any>
  performed_by?: string
  ip_address?: string
}

export async function logAuditEvent({
  entity_type,
  entity_id,
  action,
  changes,
  performed_by,
  ip_address,
}: AuditLogEntry) {
  try {
    const { error } = await supabaseAdmin.from("audit_logs").insert([
      {
        entity_type,
        entity_id,
        action,
        changes,
        performed_by,
        ip_address,
        performed_at: new Date().toISOString(),
      },
    ])

    if (error) {
      console.error("Error logging audit event:", error)
      throw error
    }
  } catch (error) {
    console.error("Failed to log audit event:", error)
    // Don't throw error to prevent disrupting the main operation
  }
}

// Helper to compare objects and return changes
export function getObjectChanges(oldObj: Record<string, any>, newObj: Record<string, any>) {
  const changes: Record<string, { old: any; new: any }> = {}

  // Get all unique keys using Array.from() instead of Set iteration
  const allKeys = Array.from(new Set([...Object.keys(oldObj), ...Object.keys(newObj)]))

  for (const key of allKeys) {
    if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
      changes[key] = {
        old: oldObj[key],
        new: newObj[key],
      }
    }
  }

  return Object.keys(changes).length > 0 ? changes : undefined
} 