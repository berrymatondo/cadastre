"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Scale,
  FileText,
  Search,
  MessageSquare,
  Gavel,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  Users,
  FolderOpen,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import { useRole } from "@/lib/use-role";
import logo from "@/public/cami.png";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { icon: Home, label: "Tableau de bord", href: "/" },
  { icon: BookOpen, label: "Code minier", href: "/code-minier" },
  { icon: FileText, label: "Règlement minier", href: "/reglement-minier" },
  { icon: Search, label: "Recherche", href: "/recherche" },
  {
    icon: MessageSquare,
    label: "Assistant IA",
    href: "/assistant",
    badge: "IA",
  },
];

const secondaryNavItems: NavItem[] = [
  { icon: Gavel, label: "Conflits miniers", href: "/conflits" },
  { icon: History, label: "Jurisprudence", href: "/jurisprudence" },
  { icon: Scale, label: "Journal Officiel", href: "/journal-officiel" },
  { icon: FolderOpen, label: "Documents", href: "/documents" },
  { icon: ListChecks, label: "Actions", href: "/actions" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const role = useRole();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "hidden lg:flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
          collapsed ? "w-16" : "w-64",
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border hover:bg-sidebar-accent transition-colors"
        >
          <Image
            src={logo}
            alt="CAMI"
            width={32}
            height={32}
            className="bg-amber-50 z-20 rounded-lg shrink-0 object-cover"
          />

          {!collapsed && (
            <span className="font-semibold text-sidebar-foreground text-sm">
              Cadastre Minier
            </span>
          )}
        </Link>

        {/* Main Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <div className="mb-4">
            {!collapsed && (
              <span className="px-3 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">
                Principal
              </span>
            )}
            <div className="mt-2 space-y-1">
              {mainNavItems.map((item) => (
                <NavLink key={item.href} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-sidebar-border">
            {!collapsed && (
              <span className="px-3 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">
                Modules
              </span>
            )}
            <div className="mt-2 space-y-1">
              {secondaryNavItems.map((item) => (
                <NavLink key={item.href} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-sidebar-border">
          {role === "admin" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/admin/utilisateurs"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                    collapsed && "justify-center",
                  )}
                >
                  <Users className="w-5 h-5 shrink-0" />
                  {!collapsed && <span className="text-sm">Utilisateurs</span>}
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">Utilisateurs</TooltipContent>
              )}
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/parametres"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                  collapsed && "justify-center",
                )}
              >
                <Settings className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="text-sm">Paramètres</span>}
              </Link>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">Paramètres</TooltipContent>
            )}
          </Tooltip>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "w-full mt-2 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent",
              collapsed && "justify-center",
            )}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-2" />
                <span className="text-xs">Réduire</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}

function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

  const content = (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
        collapsed && "justify-center",
      )}
    >
      <item.icon className="w-5 h-5 shrink-0" />
      {!collapsed && (
        <>
          <span className="text-sm flex-1">{item.label}</span>
          {item.badge && (
            <span className={cn(
              "px-1.5 py-0.5 text-[10px] font-medium rounded",
              isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary text-primary-foreground"
            )}>
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {item.label}
          {item.badge && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-primary text-primary-foreground">
              {item.badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
