"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { format, isPast, startOfDay } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Plus, Pencil, Trash2, Loader2, Search, X, Paperclip, Upload, Download, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRole } from "@/lib/use-role"
import { canAdd, canEdit, canDelete } from "@/lib/permissions"

// ─── Types ───────────────────────────────────────────────────────────────────

type ActionStatut = "a_faire" | "en_cours" | "termine" | "annule"

interface Assignee { id: string; name: string; email: string }

interface Action {
  id: string
  nom: string
  description: string | null
  assigneeId: string | null
  assignee: Assignee | null
  dateEcheance: string
  statut: ActionStatut
  createdAt: string
  _count: { documents: number }
}

interface ActionDoc {
  id: string
  nom: string
  mimeType: string
  taille: number
  createdAt: string
}

interface UserMeta { id: string; name: string; email: string }

// ─── Constantes ──────────────────────────────────────────────────────────────

const STATUT_CONFIG: Record<ActionStatut, { label: string; className: string }> = {
  a_faire:  { label: "À faire",  className: "bg-muted text-muted-foreground border-border" },
  en_cours: { label: "En cours", className: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400" },
  termine:  { label: "Terminé",  className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400" },
  annule:   { label: "Annulé",   className: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400" },
}

const STATUTS: ActionStatut[] = ["a_faire", "en_cours", "termine", "annule"]

function emptyForm() {
  return { nom: "", description: "", assigneeId: "", dateEcheance: "", statut: "a_faire" as ActionStatut }
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`
}

function getExt(nom: string, mime: string) {
  const dot = nom.lastIndexOf(".")
  if (dot !== -1) return nom.slice(dot + 1).toUpperCase()
  const map: Record<string, string> = {
    "application/pdf": "PDF",
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
    "application/vnd.ms-excel": "XLS",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
    "image/jpeg": "JPG", "image/png": "PNG",
    "text/plain": "TXT",
  }
  return map[mime] ?? "FILE"
}

// ─── Panneau pièces jointes ───────────────────────────────────────────────────

function DocsPanel({ action, canUpload, canRemove, onClose, onCountChange }: {
  action: Action
  canUpload: boolean
  canRemove: boolean
  onClose: () => void
  onCountChange: (delta: number) => void
}) {
  const [docs, setDocs] = useState<ActionDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch(`/api/actions/${action.id}/documents`)
      .then(r => r.ok ? r.json() : [])
      .then(setDocs)
      .finally(() => setLoading(false))
  }, [action.id])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("fichier", file)
      const res = await fetch(`/api/actions/${action.id}/documents`, { method: "POST", body: fd })
      if (!res.ok) throw new Error()
      const doc: ActionDoc = await res.json()
      setDocs(prev => [doc, ...prev])
      onCountChange(+1)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  async function handleDelete(docId: string) {
    await fetch(`/api/actions/${action.id}/documents?docId=${docId}`, { method: "DELETE" })
    setDocs(prev => prev.filter(d => d.id !== docId))
    onCountChange(-1)
  }

  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Paperclip className="w-4 h-4" />
            Pièces jointes — {action.nom}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {canUpload && (
            <div>
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={handleUpload}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full border-dashed"
              >
                {uploading
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Upload en cours…</>
                  : <><Upload className="w-4 h-4 mr-2" /> Ajouter un fichier</>
                }
              </Button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-6 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Chargement…
            </div>
          ) : docs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Aucune pièce jointe
            </p>
          ) : (
            <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
              {docs.map(doc => {
                const ext = getExt(doc.nom, doc.mimeType)
                return (
                  <div key={doc.id} className="flex items-center gap-3 px-3 py-2.5 bg-card">
                    <div className="flex items-center justify-center w-8 h-8 rounded bg-muted shrink-0">
                      <span className="text-[9px] font-bold text-muted-foreground">{ext}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.nom}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatSize(doc.taille)} · {format(new Date(doc.createdAt), "dd MMM yyyy", { locale: fr })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        asChild
                      >
                        <a href={`/api/documents/${doc.id}`} download>
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </Button>
                      {canRemove && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Formulaire action ────────────────────────────────────────────────────────

function ActionForm({
  form,
  setForm,
  users,
}: {
  form: ReturnType<typeof emptyForm>
  setForm: React.Dispatch<React.SetStateAction<ReturnType<typeof emptyForm>>>
  users: UserMeta[]
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Nom de la tâche *</Label>
        <Input
          value={form.nom}
          onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
          placeholder="Ex: Renouveler le permis X"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Détails de la tâche…"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Assigné à</Label>
          <Select
            value={form.assigneeId}
            onValueChange={v => setForm(f => ({ ...f, assigneeId: v === "none" ? "" : v }))}
          >
            <SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Non assigné</SelectItem>
              {users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Statut</Label>
          <Select
            value={form.statut}
            onValueChange={v => setForm(f => ({ ...f, statut: v as ActionStatut }))}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUTS.map(s => <SelectItem key={s} value={s}>{STATUT_CONFIG[s].label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Échéance *</Label>
        <Input
          type="date"
          value={form.dateEcheance}
          onChange={e => setForm(f => ({ ...f, dateEcheance: e.target.value }))}
        />
      </div>
    </div>
  )
}

// ─── Table principale ─────────────────────────────────────────────────────────

function ActionsTableInner() {
  const role = useRole()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [actions, setActions] = useState<Action[]>([])
  const [users, setUsers] = useState<UserMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [search, setSearch] = useState("")
  const filterStatut = searchParams.get("statut") ?? ""
  const filterAssignee = searchParams.get("assignee") ?? ""

  const [showCreate, setShowCreate] = useState(false)
  const [editAction, setEditAction] = useState<Action | null>(null)
  const [deleteAction, setDeleteAction] = useState<Action | null>(null)
  const [docsAction, setDocsAction] = useState<Action | null>(null)
  const [form, setForm] = useState(emptyForm())

  useEffect(() => {
    Promise.all([
      fetch("/api/actions").then(r => r.ok ? r.json() : []),
      fetch("/api/admin/users").then(r => r.ok ? r.json() : []),
    ]).then(([acts, usrs]) => {
      setActions(acts)
      setUsers(usrs)
    }).finally(() => setLoading(false))
  }, [])

  function setParam(key: string, value: string) {
    const p = new URLSearchParams(searchParams.toString())
    if (value) p.set(key, value)
    else p.delete(key)
    router.replace(`?${p.toString()}`)
  }

  function resetFilters() {
    setSearch("")
    router.replace("?")
  }

  const today = startOfDay(new Date())
  const hasFilters = search || filterStatut || filterAssignee

  const filtered = actions.filter(a => {
    if (search && !a.nom.toLowerCase().includes(search.toLowerCase()) &&
        !a.description?.toLowerCase().includes(search.toLowerCase())) return false
    if (filterStatut && a.statut !== filterStatut) return false
    if (filterAssignee && a.assigneeId !== filterAssignee) return false
    return true
  })

  function openCreate() { setForm(emptyForm()); setShowCreate(true) }

  function openEdit(a: Action) {
    setForm({
      nom: a.nom,
      description: a.description ?? "",
      assigneeId: a.assigneeId ?? "",
      dateEcheance: a.dateEcheance.slice(0, 10),
      statut: a.statut,
    })
    setEditAction(a)
  }

  async function handleCreate() {
    setSaving(true)
    try {
      const res = await fetch("/api/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: form.nom,
          description: form.description || null,
          assigneeId: form.assigneeId || null,
          dateEcheance: form.dateEcheance,
          statut: form.statut,
        }),
      })
      if (!res.ok) throw new Error()
      const created: Action = await res.json()
      setActions(prev => [...prev, created].sort(
        (a, b) => new Date(a.dateEcheance).getTime() - new Date(b.dateEcheance).getTime()
      ))
      setShowCreate(false)
    } finally { setSaving(false) }
  }

  async function handleEdit() {
    if (!editAction) return
    setSaving(true)
    try {
      const res = await fetch(`/api/actions/${editAction.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: form.nom,
          description: form.description || null,
          assigneeId: form.assigneeId || null,
          dateEcheance: form.dateEcheance,
          statut: form.statut,
        }),
      })
      if (!res.ok) throw new Error()
      const updated: Action = await res.json()
      setActions(prev => prev.map(a => a.id === updated.id ? updated : a))
      setEditAction(null)
    } finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!deleteAction) return
    setSaving(true)
    try {
      await fetch(`/api/actions/${deleteAction.id}`, { method: "DELETE" })
      setActions(prev => prev.filter(a => a.id !== deleteAction.id))
      setDeleteAction(null)
    } finally { setSaving(false) }
  }

  function isOverdue(a: Action) {
    return a.statut !== "termine" && a.statut !== "annule" &&
      isPast(new Date(a.dateEcheance)) && new Date(a.dateEcheance) < today
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Chargement…
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Barre d'outils */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Rechercher…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 h-8 w-48 text-sm"
            />
          </div>
          <Select value={filterStatut} onValueChange={v => setParam("statut", v === "all" ? "" : v)}>
            <SelectTrigger className="h-8 w-36 text-sm">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {STATUTS.map(s => <SelectItem key={s} value={s}>{STATUT_CONFIG[s].label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterAssignee} onValueChange={v => setParam("assignee", v === "all" ? "" : v)}>
            <SelectTrigger className="h-8 w-44 text-sm">
              <SelectValue placeholder="Assigné" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-muted-foreground">
              <X className="w-3.5 h-3.5 mr-1" /> Réinitialiser
            </Button>
          )}
        </div>
        {canAdd(role) && (
          <Button size="sm" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-1" /> Nouvelle action
          </Button>
        )}
      </div>

      {/* Tableau */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-10 text-xs">#</TableHead>
              <TableHead className="text-xs">Tâche</TableHead>
              <TableHead className="text-xs hidden md:table-cell">Description</TableHead>
              <TableHead className="text-xs">Assigné à</TableHead>
              <TableHead className="text-xs">Échéance</TableHead>
              <TableHead className="text-xs">Statut</TableHead>
              <TableHead className="text-xs w-10 text-center">
                <Paperclip className="w-3.5 h-3.5 inline" />
              </TableHead>
              <TableHead className="text-xs w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-sm text-muted-foreground">
                  Aucune action trouvée
                </TableCell>
              </TableRow>
            ) : filtered.map((a, i) => {
              const overdue = isOverdue(a)
              return (
                <TableRow key={a.id} className={cn(overdue && "bg-red-500/5")}>
                  <TableCell className="text-xs text-muted-foreground font-mono">{i + 1}</TableCell>
                  <TableCell>
                    <span className={cn("text-sm font-medium", overdue && "text-destructive")}>
                      {a.nom}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-xs text-muted-foreground line-clamp-2">
                      {a.description ?? "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {a.assignee?.name ?? <span className="italic opacity-50">Non assigné</span>}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={cn("text-sm", overdue && "text-destructive font-medium")}>
                      {format(new Date(a.dateEcheance), "dd MMM yyyy", { locale: fr })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs", STATUT_CONFIG[a.statut].className)}>
                      {STATUT_CONFIG[a.statut].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      title="Pièces jointes"
                      onClick={() => setDocsAction(a)}
                      className="relative inline-flex items-center justify-center h-7 w-7 rounded hover:bg-accent transition-colors"
                    >
                      <FileText className={cn(
                        "w-3.5 h-3.5",
                        a._count.documents > 0 ? "text-primary" : "text-muted-foreground"
                      )} />
                      {a._count.documents > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center px-0.5 leading-none">
                          {a._count.documents > 9 ? "9+" : a._count.documents}
                        </span>
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {canEdit(role) && (
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(a)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      {canDelete(role) && (
                        <Button
                          variant="ghost" size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => setDeleteAction(a)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} action{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Pièces jointes */}
      {docsAction && (
        <DocsPanel
          action={docsAction}
          canUpload={canAdd(role)}
          canRemove={canDelete(role)}
          onClose={() => setDocsAction(null)}
          onCountChange={(delta) => {
            setActions(prev => prev.map(a =>
              a.id === docsAction.id
                ? { ...a, _count: { documents: a._count.documents + delta } }
                : a
            ))
          }}
        />
      )}

      {/* Dialog création */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Nouvelle action</DialogTitle></DialogHeader>
          <ActionForm form={form} setForm={setForm} users={users} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Annuler</Button>
            <Button onClick={handleCreate} disabled={saving || !form.nom || !form.dateEcheance}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog édition */}
      <Dialog open={!!editAction} onOpenChange={o => !o && setEditAction(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Modifier l&apos;action</DialogTitle></DialogHeader>
          <ActionForm form={form} setForm={setForm} users={users} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditAction(null)}>Annuler</Button>
            <Button onClick={handleEdit} disabled={saving || !form.nom || !form.dateEcheance}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog suppression */}
      <Dialog open={!!deleteAction} onOpenChange={o => !o && setDeleteAction(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Supprimer l&apos;action</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Supprimer <strong>{deleteAction?.nom}</strong> ? Cette action est irréversible.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAction(null)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function ActionsTable() {
  return (
    <Suspense>
      <ActionsTableInner />
    </Suspense>
  )
}
