"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Scale, MessageSquare, Clock } from "lucide-react"

const activities = [
  {
    id: 1,
    title: "Mise à jour du décret n°2024-156",
    description: "Modification des conditions d'octroi des permis d'exploitation",
    time: "Il y a 2 h",
    icon: FileText,
    badge: "Nouveau",
  },
  {
    id: 2,
    title: "Nouveau cas de conflit enregistré",
    description: "Litige foncier - Zone de Kolwezi",
    time: "Il y a 5 h",
    icon: Scale,
    badge: "En cours",
  },
  {
    id: 3,
    title: "Consultation IA",
    description: "Analyse des procédures d'attribution minière",
    time: "Il y a 1 j",
    icon: MessageSquare,
    badge: "Résolu",
  },
  {
    id: 4,
    title: "Arrêté ministériel n°0045/2024",
    description: "Nouvelles dispositions fiscales secteur minier",
    time: "Il y a 2 j",
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
        <CardDescription className="text-xs sm:text-sm hidden sm:block">
          Dernières mises à jour et consultations
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="divide-y divide-border -mx-3 sm:mx-0 sm:divide-y-0 sm:space-y-2">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 px-3 py-2.5 sm:px-3 sm:py-3 sm:rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              {/* Icône */}
              <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary/10 shrink-0">
                <activity.icon className="w-4 h-4 text-primary" />
              </div>

              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs sm:text-sm text-foreground truncate leading-tight">
                  {activity.title}
                </p>
                {/* Description masquée sur très petits écrans */}
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate mt-0.5 hidden xs:block">
                  {activity.description}
                </p>
                <div className="flex items-center gap-1 mt-0.5 text-[10px] text-muted-foreground">
                  <Clock className="w-2.5 h-2.5 shrink-0" />
                  <span>{activity.time}</span>
                </div>
              </div>

              {/* Badge à droite */}
              <Badge
                variant={badgeVariants[activity.badge] ?? "default"}
                className="text-[10px] shrink-0 hidden sm:inline-flex"
              >
                {activity.badge}
              </Badge>
              {/* Badge mobile : point coloré */}
              <div className={`w-2 h-2 rounded-full shrink-0 sm:hidden ${
                activity.badge === "Nouveau" ? "bg-primary" :
                activity.badge === "En cours" ? "bg-amber-500" :
                activity.badge === "Important" ? "bg-destructive" :
                "bg-muted-foreground/40"
              }`} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
