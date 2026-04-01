"use client"

import { useRouter } from "next/navigation"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useSession, signOut } from "@/lib/auth-client"
import { getRoleLabel, getRoleColor } from "@/lib/permissions"

export function UserMenu() {
  const router = useRouter()
  const { data: session } = useSession()

  const user     = session?.user
  const role     = (user as { role?: string } | undefined)?.role
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??"

  async function handleSignOut() {
    await signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2 sm:px-3">
          <Avatar className="w-7 h-7 sm:w-8 sm:h-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col items-start gap-0.5">
            <span className="text-sm font-medium leading-none">{user?.name ?? "…"}</span>
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 py-0 h-4 font-normal ${getRoleColor(role)}`}
            >
              {getRoleLabel(role)}
            </Badge>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>
          <div className="space-y-0.5">
            <p className="font-medium">{user?.name ?? "…"}</p>
            <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="w-4 h-4 mr-2" />
          Profil
        </DropdownMenuItem>
        <DropdownMenuItem>Paramètres</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
