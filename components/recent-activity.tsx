"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Scale, MessageSquare, Clock } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "update",
    title: "Mise à jour du décret n°2024-156",
    description: "Modification des conditions d'octroi des permis d'exploitation",
    time: "Il y a 2 heures",
    icon: FileText,
    badge: "Nouveau",
  },
  {
    id: 2,
    type: "conflict",
    title: "Nouveau cas de conflit enregistré",
    description: "Litige foncier - Zone de Kolwezi",
    time: "Il y a 5 heures",
    icon: Scale,
    badge: "En cours",
  },
  {
    id: 3,
    type: "ai",
    title: "Consultation IA",
    description: "Analyse des procédures d'attribution minière",
    time: "Il y a 1 jour",
    icon: MessageSquare,
    badge: "Résolu",
  },
  {
    id: 4,
    type: "update",
    title: "Arrêté ministériel n°0045/2024",
    description: "Nouvelles dispositions fiscales secteur minier",
    time: "Il y a 2 jours",
    icon: FileText,
    badge: "Important",
  },
]

const badgeVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  "Nouveau": "default",
  "En cours": "secondary",
  "Résolu": "outline",
  "Important": "destructive",
}

export function RecentActivity() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
        <CardTitle className="text-foreground text-base sm:text-lg">Activités récentes</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Dernières mises à jour et consultations</CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
        <div className="space-y-2 sm:space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 shrink-0">
                <activity.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                  <p className="font-medium text-xs sm:text-sm text-foreground truncate">
                    {activity.title}
                  </p>
                  <Badge variant={badgeVariants[activity.badge] || "default"} className="self-start text-[10px] sm:text-xs">
                    {activity.badge}
                  </Badge>
                </div>
                <p className="text-[10px] sm:text-sm text-muted-foreground truncate">
                  {activity.description}
                </p>
                <div className="flex items-center gap-1 mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-muted-foreground">
                  <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
