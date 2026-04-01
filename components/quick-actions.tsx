"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Search, MessageSquare, Gavel, ArrowRight } from "lucide-react"

const actions = [
  {
    title: "Consulter le Code minier",
    description: "Accédez aux articles et dispositions légales",
    icon: BookOpen,
    href: "/code-minier",
    color: "bg-chart-1/10 text-chart-1",
  },
  {
    title: "Recherche avancée",
    description: "Trouvez rapidement les textes pertinents",
    icon: Search,
    href: "/recherche",
    color: "bg-chart-2/10 text-chart-2",
  },
  {
    title: "Assistant IA",
    description: "Posez vos questions juridiques",
    icon: MessageSquare,
    href: "/assistant",
    color: "bg-chart-3/10 text-chart-3",
  },
  {
    title: "Gestion des conflits",
    description: "Consultez les cas et précédents",
    icon: Gavel,
    href: "/conflits",
    color: "bg-chart-4/10 text-chart-4",
  },
]

export function QuickActions() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
        <CardTitle className="text-foreground text-base sm:text-lg">Actions rapides</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Accès direct aux fonctionnalités principales</CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
        <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
          {actions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
            >
              <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg shrink-0 ${action.color}`}>
                <action.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors">
                  {action.title}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {action.description}
                </p>
              </div>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all mt-0.5 sm:mt-1 shrink-0" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
