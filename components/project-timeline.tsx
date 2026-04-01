"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

const phases = [
  {
    title: "Phase 1 - Numérisation",
    description: "Numérisation des documents papier du Code et Règlement minier",
    status: "completed",
    date: "Terminée",
  },
  {
    title: "Phase 2 - Structuration",
    description: "Organisation et indexation des textes juridiques",
    status: "completed",
    date: "Terminée",
  },
  {
    title: "Phase 3 - MVP",
    description: "Version utilisable avec recherche et assistant IA",
    status: "in-progress",
    date: "Juillet 2024",
  },
  {
    title: "Phase 4 - Jurisprudence",
    description: "Intégration de la base de jurisprudence et conflits",
    status: "pending",
    date: "Q4 2024",
  },
  {
    title: "Phase 5 - Maintenance",
    description: "Contrat de maintenance et mises à jour continues",
    status: "pending",
    date: "2025+",
  },
]

const statusIcons = {
  completed: CheckCircle2,
  "in-progress": Clock,
  pending: Circle,
}

const statusColors = {
  completed: "text-primary bg-primary/20",
  "in-progress": "text-chart-3 bg-chart-3/20",
  pending: "text-muted-foreground bg-muted",
}

export function ProjectTimeline() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
        <CardTitle className="text-foreground text-base sm:text-lg">Phasage du projet</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Avancement de la digitalisation</CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
        <div className="space-y-2 sm:space-y-4">
          {phases.map((phase, index) => {
            const Icon = statusIcons[phase.status as keyof typeof statusIcons]
            const colorClass = statusColors[phase.status as keyof typeof statusColors]
            
            return (
              <div key={phase.title} className="flex gap-2 sm:gap-4">
                <div className="flex flex-col items-center">
                  <div className={cn("flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full shrink-0", colorClass)}>
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  {index < phases.length - 1 && (
                    <div className={cn(
                      "w-0.5 flex-1 my-1 sm:my-2",
                      phase.status === "completed" ? "bg-primary" : "bg-border"
                    )} />
                  )}
                </div>
                <div className="flex-1 pb-2 sm:pb-4 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
                    <p className="font-medium text-xs sm:text-sm text-foreground truncate">{phase.title}</p>
                    <span className={cn(
                      "text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded w-fit shrink-0",
                      phase.status === "completed" && "bg-primary/10 text-primary",
                      phase.status === "in-progress" && "bg-chart-3/10 text-chart-3",
                      phase.status === "pending" && "bg-muted text-muted-foreground"
                    )}>
                      {phase.date}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 line-clamp-2">
                    {phase.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
