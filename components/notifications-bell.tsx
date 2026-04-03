"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, Clock, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { addWeeks, isPast, isWithinInterval, startOfDay } from "date-fns"
import { cn } from "@/lib/utils"

interface DocumentMeta {
  id: string
  nom: string
  categorie: string
  dateEcheance: string
  mimeType: string
}

interface ActionMeta {
  id: string
  nom: string
  statut: string
  dateEcheance: string
}

interface AlertItem {
  id: string
  label: string
  subtitle: string
  date: string
  expired: boolean
  href: string
}

export function NotificationsBell() {
  const [docs, setDocs] = useState<DocumentMeta[]>([])
  const [actions, setActions] = useState<ActionMeta[]>([])
  const [semainesDoc, setSemainesDoc] = useState(4)
  const [semainesAction, setSemainesAction] = useState(4)

  useEffect(() => {
    Promise.all([
      fetch("/api/documents").then(r => r.ok ? r.json() : []),
      fetch("/api/actions").then(r => r.ok ? r.json() : []),
      fetch("/api/parametres").then(r => r.ok ? r.json() : []),
    ]).then(([d, a, p]) => {
      setDocs(d)
      setActions(a)
      const paramDoc = p.find((x: { cle: string; valeur: string }) => x.cle === "semaines_alerte_documents")
      const paramAct = p.find((x: { cle: string; valeur: string }) => x.cle === "semaines_alerte_actions")
      if (paramDoc) setSemainesDoc(parseInt(paramDoc.valeur, 10) || 4)
      if (paramAct) setSemainesAction(parseInt(paramAct.valeur, 10) || 4)
    }).catch(() => {})
  }, [])

  const today = startOfDay(new Date())

  function buildAlerts(
    items: { id: string; nom: string; subtitle: string; dateEcheance: string; href: string; statut?: string }[],
    semaines: number
  ): AlertItem[] {
    const seuil = addWeeks(today, semaines)
    return items
      .filter(item => {
        if (item.statut === "termine" || item.statut === "annule") return false
        const date = new Date(item.dateEcheance)
        return isPast(date) && date < today
          ? true
          : isWithinInterval(date, { start: today, end: seuil })
      })
      .map(item => {
        const date = new Date(item.dateEcheance)
        return {
          id: item.id,
          label: item.nom,
          subtitle: item.subtitle,
          date: item.dateEcheance,
          expired: isPast(date) && date < today,
          href: item.href,
        }
      })
  }

  const docAlerts = buildAlerts(
    docs.map(d => ({ id: d.id, nom: d.nom, subtitle: d.categorie, dateEcheance: d.dateEcheance, href: "/documents" })),
    semainesDoc
  )
  const actionAlerts = buildAlerts(
    actions.map(a => ({
      id: a.id,
      nom: a.nom,
      subtitle: "Action",
      dateEcheance: a.dateEcheance,
      href: "/actions",
      statut: a.statut,
    })),
    semainesAction
  )

  const allAlerts = [...docAlerts, ...actionAlerts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  const expiredAlerts = allAlerts.filter(a => a.expired)
  const count = allAlerts.length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {count > 0 && (
            <span className={cn(
              "absolute -top-0.5 -right-0.5 min-w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center px-1",
              expiredAlerts.length > 0
                ? "bg-destructive text-destructive-foreground"
                : "bg-amber-500 text-white"
            )}>
              {count > 99 ? "99+" : count}
            </span>
          )}
          {count === 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-muted rounded-full" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="font-semibold text-sm">Notifications</span>
          {count > 0 && (
            <Badge variant="secondary" className="text-xs">
              {count} alerte{count > 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        {count === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            Aucune alerte
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {allAlerts.map(item => (
              <Link key={`${item.href}-${item.id}`} href={item.href}>
                <div className={cn(
                  "px-4 py-3 flex items-start gap-3 hover:bg-muted/50 transition-colors",
                  item.expired ? "bg-red-500/5" : "bg-amber-500/5"
                )}>
                  {item.expired
                    ? <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    : <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
                    <p className={cn(
                      "text-xs font-medium mt-0.5",
                      item.expired ? "text-destructive" : "text-amber-600 dark:text-amber-400"
                    )}>
                      {item.expired
                        ? `Expiré le ${format(new Date(item.date), "dd MMM yyyy", { locale: fr })}`
                        : `Échéance le ${format(new Date(item.date), "dd MMM yyyy", { locale: fr })}`
                      }
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="px-4 py-2 border-t border-border flex gap-3">
          <Link href="/documents" className="text-xs text-primary hover:underline">Documents →</Link>
          <Link href="/actions" className="text-xs text-primary hover:underline">Actions →</Link>
          <Link href="/parametres" className="text-xs text-muted-foreground hover:underline ml-auto">Paramètres</Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
