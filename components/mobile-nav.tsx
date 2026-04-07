"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  Scale,
  FileText,
  Search,
  Sparkles,
  Gavel,
  History,
  Settings,
  Home,
  Menu,
  X,
  FolderOpen,
  ListChecks,
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
]

const secondaryNavItems: NavItem[] = [
  { icon: Gavel, label: "Conflits miniers", href: "/conflits" },
  { icon: History, label: "Jurisprudence", href: "/jurisprudence" },
  { icon: Scale, label: "Journal Officiel", href: "/journal-officiel" },
  { icon: FolderOpen, label: "Documents", href: "/documents" },
  { icon: ListChecks, label: "Actions", href: "/actions" },
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
                </Link>
              ))}

              {/* Assistant IA — entrée spéciale */}
              <Link
                href="/assistant"
                onClick={() => setOpen(false)}
                className="relative mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl overflow-hidden group bg-linear-to-r from-primary/20 via-primary/10 to-transparent border border-primary/30 hover:border-primary/60 transition-all"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-primary/10 to-transparent" />
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/20 shrink-0">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-sidebar-foreground leading-tight">Assistant IA</p>
                  <p className="text-[10px] text-sidebar-foreground/50 leading-tight">Analyse juridique</p>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/30 text-primary shrink-0">IA</span>
              </Link>
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
