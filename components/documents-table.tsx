"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { addWeeks, isPast, isWithinInterval, startOfDay } from "date-fns"
import { fr } from "date-fns/locale"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Upload, Download, Trash2, Loader2, FileUp, AlertTriangle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRole } from "@/lib/use-role"
import { canAdd, canDelete } from "@/lib/permissions"

interface DocumentMeta {
  id: string
  nom: string
  categorie: string
  dateEcheance: string
  taille: number
  mimeType: string
  createdAt: string
}

const CATEGORIES = ["Permis", "Contrat", "Rapport", "Licence", "Certificat", "Procès-verbal", "Autre"]

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

function DocumentsTableInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const semaines = parseInt(searchParams.get("semaines") ?? "4", 10)

  const role = useRole()
  const [docs, setDocs] = useState<DocumentMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<DocumentMeta | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  // Upload form
  const [nom, setNom] = useState("")
  const [categorie, setCategorie] = useState("")
  const [dateEcheance, setDateEcheance] = useState("")
  const [fichier, setFichier] = useState<File | null>(null)

  const fetchDocs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/documents")
      if (res.ok) setDocs(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchDocs() }, [fetchDocs])

  function getStatus(dateEcheanceStr: string): "expired" | "warning" | "ok" {
    const date = new Date(dateEcheanceStr)
    const today = startOfDay(new Date())
    if (isPast(date) && date < today) return "expired"
    if (isWithinInterval(date, { start: today, end: addWeeks(today, semaines) })) return "warning"
    return "ok"
  }

  function handleSemainesChange(val: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("semaines", val)
    router.replace(`/documents?${params.toString()}`)
  }

  async function handleUpload() {
    if (!nom || !categorie || !dateEcheance || !fichier) {
      setError("Tous les champs sont requis")
      return
    }
    setSaving(true)
    setError("")
    try {
      const fd = new FormData()
      fd.append("nom", nom)
      fd.append("categorie", categorie)
      fd.append("dateEcheance", dateEcheance)
      fd.append("fichier", fichier)

      const res = await fetch("/api/documents", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Erreur lors de l'upload"); return }

      setUploadOpen(false)
      setNom(""); setCategorie(""); setDateEcheance(""); setFichier(null)
      fetchDocs()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setSaving(true)
    try {
      await fetch(`/api/documents/${deleteTarget.id}`, { method: "DELETE" })
      setDeleteTarget(null)
      fetchDocs()
    } finally {
      setSaving(false)
    }
  }

  function handleDownload(doc: DocumentMeta) {
    window.location.href = `/api/documents/${doc.id}`
  }

  const expiredCount = docs.filter((d) => getStatus(d.dateEcheance) === "expired").length
  const warningCount = docs.filter((d) => getStatus(d.dateEcheance) === "warning").length

  return (
    <div className="space-y-4">
      {/* Barre de contrôle */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Paramètre semaines */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">Alerte si échéance dans</span>
            <Select value={String(semaines)} onValueChange={handleSemainesChange}>
              <SelectTrigger className="w-24 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,6,8,12].map((n) => (
                  <SelectItem key={n} value={String(n)}>{n} sem.</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Compteurs */}
          {expiredCount > 0 && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="w-3 h-3" />
              {expiredCount} expiré{expiredCount > 1 ? "s" : ""}
            </Badge>
          )}
          {warningCount > 0 && (
            <Badge className="gap-1 bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20">
              <Clock className="w-3 h-3" />
              {warningCount} bientôt
            </Badge>
          )}
        </div>

        {canAdd(role) && (
          <Button size="sm" className="gap-2 shrink-0" onClick={() => { setError(""); setUploadOpen(true) }}>
            <FileUp className="w-4 h-4" />
            Ajouter un document
          </Button>
        )}
      </div>

      {/* Tableau */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : docs.length === 0 ? (
        <div className="text-center py-12 border rounded-lg border-dashed text-muted-foreground">
          <Upload className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Aucun document enregistré</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Date d&apos;échéance</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map((doc) => {
                const status = getStatus(doc.dateEcheance)
                return (
                  <TableRow
                    key={doc.id}
                    className={cn(
                      status === "expired" && "bg-red-500/8 hover:bg-red-500/12",
                      status === "warning" && "bg-amber-500/8 hover:bg-amber-500/12",
                    )}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {status === "expired" && <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0" />}
                        {status === "warning" && <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                        <span>{doc.nom}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{doc.categorie}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-sm",
                          status === "expired" && "text-destructive font-medium",
                          status === "warning" && "text-amber-600 dark:text-amber-400 font-medium",
                        )}>
                          {format(new Date(doc.dateEcheance), "dd MMM yyyy", { locale: fr })}
                        </span>
                        {status === "expired" && <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Expiré</Badge>}
                        {status === "warning" && <Badge className="text-[10px] px-1.5 py-0 bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30">Bientôt</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatSize(doc.taille)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownload(doc)} title="Télécharger">
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                        {canDelete(role) && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(doc)} title="Supprimer">
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
      )}

      {/* Dialog upload */}
      <Dialog open={uploadOpen} onOpenChange={(o) => !o && setUploadOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="doc-nom">Nom du document</Label>
              <Input id="doc-nom" placeholder="Permis d'exploitation n°123" value={nom} onChange={(e) => setNom(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Catégorie</Label>
              <Select value={categorie} onValueChange={setCategorie}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie…" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="doc-echeance">Date d&apos;échéance</Label>
              <Input id="doc-echeance" type="date" value={dateEcheance} onChange={(e) => setDateEcheance(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="doc-fichier">Fichier</Label>
              <Input
                id="doc-fichier"
                type="file"
                className="cursor-pointer"
                onChange={(e) => setFichier(e.target.files?.[0] ?? null)}
              />
              {fichier && <p className="text-xs text-muted-foreground">{fichier.name} — {formatSize(fichier.size)}</p>}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)} disabled={saving}>Annuler</Button>
            <Button onClick={handleUpload} disabled={saving} className="gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog suppression */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le document</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Êtes-vous sûr de vouloir supprimer{" "}
            <span className="font-medium text-foreground">{deleteTarget?.nom}</span> ?
            Cette action est irréversible.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={saving}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving} className="gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function DocumentsTable() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>}>
      <DocumentsTableInner />
    </Suspense>
  )
}
