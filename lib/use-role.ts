"use client"

import { useState, useEffect } from "react"
import { authClient } from "./auth-client"

/**
 * Retourne le rôle de l'utilisateur connecté côté client.
 * Utilise getSession() dans un useEffect pour éviter le crash SSR
 * lié à useSession() de better-auth (useRef null pendant le pre-render).
 */
export function useRole(): string | undefined {
  const [role, setRole] = useState<string | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    authClient.getSession().then(({ data }) => {
      if (!cancelled) {
        const r = (data?.user as { role?: string } | undefined)?.role
        setRole(r)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  return role
}
