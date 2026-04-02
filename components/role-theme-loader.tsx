"use client"

import dynamic from "next/dynamic"

const RoleTheme = dynamic(
  () => import("@/components/role-theme").then((m) => ({ default: m.RoleTheme })),
  { ssr: false }
)

export function RoleThemeLoader() {
  return <RoleTheme />
}
