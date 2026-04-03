"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save, CheckCircle2, Lock } from "lucide-react"
import { useRole } from "@/lib/use-role"
import { canEdit } from "@/lib/permissions"
import { cn } from "@/lib/utils"

interface Parametre {
  cle: string
  valeur: string
  label: string
  updatedAt: string
}

export function ParametresForm() {
  const role = useRole()
  const editable = canEdit(role)

  const [params, setParams] = useState<Parametre[]>([])
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch("/api/parametres")
      .then(r => r.ok ? r.json() : [])
      .then((data: Parametre[]) => {
        setParams(data)
        setValues(Object.fromEntries(data.map(p => [p.cle, p.valeur])))
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      const updates = Object.entries(values).map(([cle, valeur]) => ({ cle, valeur }))
      const res = await fetch("/api/parametres", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error()
      const updated: Parametre[] = await res.json()
      setParams(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const dirty = params.some(p => values[p.cle] !== p.valeur)

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-8">
        <Loader2 className="w-4 h-4 animate-spin" /> Chargement…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Alertes & notifications */}
      <section className="rounded-lg border border-border bg-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-sm">Alertes et notifications</h2>
          {!editable && <Lock className="w-3.5 h-3.5 text-muted-foreground" />}
        </div>
        <p className="text-xs text-muted-foreground">
          Nombre de semaines avant échéance à partir duquel une alerte est déclenchée dans les notifications.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {params.map(p => (
            <div key={p.cle} className="space-y-1.5">
              <Label className="text-sm">{p.label}</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={52}
                  value={values[p.cle] ?? p.valeur}
                  onChange={e => setValues(v => ({ ...v, [p.cle]: e.target.value }))}
                  disabled={!editable}
                  className={cn("w-24", !editable && "opacity-60")}
                />
                <span className="text-sm text-muted-foreground">semaine{parseInt(values[p.cle] ?? p.valeur) > 1 ? "s" : ""}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {editable && (
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving || !dirty}>
            {saving
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enregistrement…</>
              : <><Save className="w-4 h-4 mr-2" /> Enregistrer</>
            }
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Paramètres enregistrés
            </span>
          )}
        </div>
      )}

      {!editable && (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          Seuls les administrateurs et managers peuvent modifier ces paramètres.
        </p>
      )}
    </div>
  )
}
