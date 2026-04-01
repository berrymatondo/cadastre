"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FileText, Gavel, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Articles du Code",
    value: "847",
    change: "+12 ce mois",
    icon: BookOpen,
    color: "text-chart-1",
  },
  {
    title: "Textes réglementaires",
    value: "234",
    change: "+5 ce mois",
    icon: FileText,
    color: "text-chart-2",
  },
  {
    title: "Cas de jurisprudence",
    value: "156",
    change: "+8 ce mois",
    icon: Gavel,
    color: "text-chart-3",
  },
  {
    title: "Requêtes IA",
    value: "1,234",
    change: "+23% ce mois",
    icon: TrendingUp,
    color: "text-chart-4",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
              {stat.title}
            </CardTitle>
            <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color} shrink-0`} />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
