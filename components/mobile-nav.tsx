"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  Scale,
  FileText,
  Search,
  MessageSquare,
  Gavel,
  History,
  Settings,
  Sparkles,
  Home,
  Menu,
  X,
  FolderOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
  badge?: string
}

const mainNavItems: NavItem[] = [
  { icon: Home, label: "Tableau de bord", href: "/" },
  { icon: BookOpen, label: "Code minier", href: "/code-minier" },
  { icon: FileText, label: "Règlement minier", href: "/reglement-minier" },
  { icon: Search, label: "Recherche", href: "/recherche" },
  { icon: MessageSquare, label: "Assistant IA", href: "/assistant", badge: "IA" },
]

const secondaryNavItems: NavItem[] = [
  { icon: Gavel, label: "Conflits miniers", href: "/conflits" },
  { icon: History, label: "Jurisprudence", href: "/jurisprudence" },
  { icon: Scale, label: "Journal Officiel", href: "/journal-officiel" },
  { icon: FolderOpen, label: "Documents", href: "/documents" },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 bg-sidebar border-sidebar-border">
        <SheetHeader className="flex flex-row items-center gap-3 px-4 h-16 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <SheetTitle className="text-sidebar-foreground text-sm font-semibold">
            CadastreMinier
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <div className="mb-4">
            <span className="px-3 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">
              Principal
            </span>
            <div className="mt-2 space-y-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="text-sm flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-primary text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-sidebar-border">
            <span className="px-3 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">
              Modules
            </span>
            <div className="mt-2 space-y-1">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-2 border-t border-sidebar-border">
          <Link
            href="/parametres"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <Settings className="w-5 h-5 shrink-0" />
            <span className="text-sm">Paramètres</span>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
