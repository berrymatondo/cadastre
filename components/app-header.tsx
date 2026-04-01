"use client"

import dynamic from "next/dynamic"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MobileNav } from "@/components/mobile-nav"

// Chargé uniquement côté client pour éviter le crash SSR de useSession (better-auth)
const UserMenu = dynamic(
  () => import("@/components/user-menu").then((m) => ({ default: m.UserMenu })),
  { ssr: false }
)

interface AppHeaderProps {
  title: string
  subtitle?: string
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-6 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <MobileNav />
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground truncate hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search - desktop */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="pl-9 w-48 lg:w-64 bg-background"
          />
        </div>

        {/* Search - mobile */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="w-5 h-5" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </Button>

        {/* User menu — client-only (useSession) */}
        <UserMenu />
      </div>
    </header>
  )
}
