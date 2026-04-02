"use client"

import { useEffect } from "react"
import { useRole } from "@/lib/use-role"

const ROLE_CLASSES = ["role-admin", "role-manager", "role-agent"]

export function RoleTheme() {
  const role = useRole()

  useEffect(() => {
    const body = document.body
    // Retirer toute classe de rôle existante
    ROLE_CLASSES.forEach((c) => body.classList.remove(c))
    // Appliquer la classe du rôle courant
    if (role) {
      body.classList.add(`role-${role}`)
    }
  }, [role])

  return null
}
