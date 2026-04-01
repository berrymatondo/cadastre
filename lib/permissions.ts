export type UserRole = "admin" | "manager" | "agent"

/** Admin only */
export function canDelete(role?: string | null): boolean {
  return role === "admin"
}

/** Admin + Manager */
export function canEdit(role?: string | null): boolean {
  return role === "admin" || role === "manager"
}

/** Admin + Manager */
export function canAdd(role?: string | null): boolean {
  return role === "admin" || role === "manager"
}

export function getRoleLabel(role?: string | null): string {
  switch (role) {
    case "admin":   return "Admin"
    case "manager": return "Manager"
    default:        return "Agent"
  }
}

export function getRoleColor(role?: string | null): string {
  switch (role) {
    case "admin":   return "bg-red-500/10 text-red-500 border-red-500/20 dark:text-red-400"
    case "manager": return "bg-blue-500/10 text-blue-500 border-blue-500/20 dark:text-blue-400"
    default:        return "bg-muted text-muted-foreground"
  }
}
