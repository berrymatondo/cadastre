"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Filter, Eye, Plus, ChevronRight, Pencil, Trash2 } from "lucide-react"

interface Conflict {
  id: string
  reference: string
  type: string
  parties: string
  zone: string
  dateOuverture: string
  statut: "en_cours" | "resolu" | "appel"
  decision?: string
  description?: string
}

const initialConflicts: Conflict[] = [
  {
    id: "1",
    reference: "CM-2024-001",
    type: "Foncier",
    parties: "Société ABC vs Communauté Locale X",
    zone: "Kolwezi",
    dateOuverture: "2024-01-15",
    statut: "en_cours",
    description: "Litige concernant les droits fonciers sur le périmètre minier attribué.",
  },
  {
    id: "2",
    reference: "CM-2024-002",
    type: "Chevauchement",
    parties: "Mining Corp vs Exploitation Y",
    zone: "Lubumbashi",
    dateOuverture: "2024-02-22",
    statut: "resolu",
    decision: "Attribution à Mining Corp selon droit de priorité",
    description: "Chevauchement de périmètres détecté lors de la digitalisation.",
  },
  {
    id: "3",
    reference: "CM-2023-087",
    type: "Environnemental",
    parties: "État vs Société Z",
    zone: "Kipushi",
    dateOuverture: "2023-09-10",
    statut: "appel",
    decision: "Suspension temporaire - en appel",
    description: "Non-respect des normes environnementales dans le cadre de l'exploitation.",
  },
  {
    id: "4",
    reference: "CM-2024-003",
    type: "Foncier",
    parties: "Communauté B vs Entreprise W",
    zone: "Likasi",
    dateOuverture: "2024-03-05",
    statut: "en_cours",
    description: "Revendication de droits coutumiers sur un terrain exploité.",
  },
  {
    id: "5",
    reference: "CM-2023-065",
    type: "Fiscal",
    parties: "Administration vs Société V",
    zone: "Fungurume",
    dateOuverture: "2023-07-18",
    statut: "resolu",
    decision: "Paiement des arriérés + pénalités",
    description: "Contentieux fiscal relatif aux redevances minières impayées.",
  },
]

const statusConfig = {
  en_cours: { label: "En cours", variant: "secondary" as const },
  resolu: { label: "Résolu", variant: "default" as const },
  appel: { label: "En appel", variant: "destructive" as const },
}

const conflictTypes = ["Foncier", "Chevauchement", "Environnemental", "Fiscal", "Social", "Autre"]
const zones = ["Kolwezi", "Lubumbashi", "Kipushi", "Likasi", "Fungurume", "Kasumbalesa", "Autre"]

interface ConflictFormData {
  reference: string
  type: string
  parties: string
  zone: string
  dateOuverture: string
  statut: "en_cours" | "resolu" | "appel"
  decision: string
  description: string
}

const emptyFormData: ConflictFormData = {
  reference: "",
  type: "",
  parties: "",
  zone: "",
  dateOuverture: "",
  statut: "en_cours",
  decision: "",
  description: "",
}

export function ConflictsTable() {
  const [conflicts, setConflicts] = useState<Conflict[]>(initialConflicts)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null)
  const [formData, setFormData] = useState<ConflictFormData>(emptyFormData)

  const filteredConflicts = conflicts.filter((conflict) => {
    const matchesSearch =
      conflict.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conflict.parties.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conflict.zone.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || conflict.statut === statusFilter

    return matchesSearch && matchesStatus
  })

  const generateReference = () => {
    const year = new Date().getFullYear()
    const count = conflicts.filter(c => c.reference.includes(year.toString())).length + 1
    return `CM-${year}-${count.toString().padStart(3, '0')}`
  }

  const handleAddNew = () => {
    setFormData({
      ...emptyFormData,
      reference: generateReference(),
      dateOuverture: new Date().toISOString().split('T')[0],
    })
    setIsAddDialogOpen(true)
  }

  const handleEdit = (conflict: Conflict) => {
    setSelectedConflict(conflict)
    setFormData({
      reference: conflict.reference,
      type: conflict.type,
      parties: conflict.parties,
      zone: conflict.zone,
      dateOuverture: conflict.dateOuverture,
      statut: conflict.statut,
      decision: conflict.decision || "",
      description: conflict.description || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleView = (conflict: Conflict) => {
    setSelectedConflict(conflict)
    setIsViewDialogOpen(true)
  }

  const handleDeleteConfirm = (conflict: Conflict) => {
    setSelectedConflict(conflict)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveNew = () => {
    const newConflict: Conflict = {
      id: Date.now().toString(),
      ...formData,
      decision: formData.decision || undefined,
      description: formData.description || undefined,
    }
    setConflicts([newConflict, ...conflicts])
    setIsAddDialogOpen(false)
    setFormData(emptyFormData)
  }

  const handleSaveEdit = () => {
    if (!selectedConflict) return
    setConflicts(conflicts.map(c => 
      c.id === selectedConflict.id 
        ? { 
            ...c, 
            ...formData,
            decision: formData.decision || undefined,
            description: formData.description || undefined,
          } 
        : c
    ))
    setIsEditDialogOpen(false)
    setSelectedConflict(null)
    setFormData(emptyFormData)
  }

  const handleDelete = () => {
    if (!selectedConflict) return
    setConflicts(conflicts.filter(c => c.id !== selectedConflict.id))
    setIsDeleteDialogOpen(false)
    setSelectedConflict(null)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR')
  }

  const isFormValid = formData.reference && formData.type && formData.parties && formData.zone && formData.dateOuverture

  const ConflictForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reference">Référence</Label>
          <Input
            id="reference"
            value={formData.reference}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            placeholder="CM-2024-XXX"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOuverture">Date d&apos;ouverture</Label>
          <Input
            id="dateOuverture"
            type="date"
            value={formData.dateOuverture}
            onChange={(e) => setFormData({ ...formData, dateOuverture: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type de conflit</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              {conflictTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="zone">Zone</Label>
          <Select value={formData.zone} onValueChange={(value) => setFormData({ ...formData, zone: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une zone" />
            </SelectTrigger>
            <SelectContent>
              {zones.map((zone) => (
                <SelectItem key={zone} value={zone}>{zone}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="parties">Parties impliquées</Label>
        <Input
          id="parties"
          value={formData.parties}
          onChange={(e) => setFormData({ ...formData, parties: e.target.value })}
          placeholder="Partie A vs Partie B"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="statut">Statut</Label>
        <Select value={formData.statut} onValueChange={(value: "en_cours" | "resolu" | "appel") => setFormData({ ...formData, statut: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en_cours">En cours</SelectItem>
            <SelectItem value="resolu">Résolu</SelectItem>
            <SelectItem value="appel">En appel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description du conflit..."
          rows={3}
        />
      </div>

      {(formData.statut === "resolu" || formData.statut === "appel") && (
        <div className="space-y-2">
          <Label htmlFor="decision">Décision</Label>
          <Textarea
            id="decision"
            value={formData.decision}
            onChange={(e) => setFormData({ ...formData, decision: e.target.value })}
            placeholder="Décision rendue..."
            rows={2}
          />
        </div>
      )}
    </div>
  )

  return (
    <Card className="bg-card border-border">
      <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-foreground text-base sm:text-lg">Gestion des conflits miniers</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Base de données des litiges et résolutions</CardDescription>
          </div>
          <Button size="sm" className="w-full sm:w-auto" onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau cas
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
        {/* Filters */}
        <div className="flex flex-col gap-3 mb-4 sm:mb-6 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background text-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-background text-sm">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="en_cours">En cours</SelectItem>
              <SelectItem value="resolu">Résolu</SelectItem>
              <SelectItem value="appel">En appel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-3">
          {filteredConflicts.map((conflict) => (
            <div
              key={conflict.id}
              className="p-3 rounded-lg border border-border"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-medium text-foreground text-sm">{conflict.reference}</p>
                  <Badge variant="outline" className="mt-1 text-xs">{conflict.type}</Badge>
                </div>
                <Badge variant={statusConfig[conflict.statut].variant} className="text-xs shrink-0">
                  {statusConfig[conflict.statut].label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{conflict.parties}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{conflict.zone}</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => handleView(conflict)}>
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => handleEdit(conflict)}>
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-destructive" onClick={() => handleDeleteConfirm(conflict)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs">Référence</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="hidden md:table-cell text-xs">Parties</TableHead>
                <TableHead className="text-xs">Zone</TableHead>
                <TableHead className="text-xs">Statut</TableHead>
                <TableHead className="text-right text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConflicts.map((conflict) => (
                <TableRow key={conflict.id}>
                  <TableCell className="font-medium text-sm">{conflict.reference}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{conflict.type}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-[200px] truncate text-sm">
                    {conflict.parties}
                  </TableCell>
                  <TableCell className="text-sm">{conflict.zone}</TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[conflict.statut].variant} className="text-xs">
                      {statusConfig[conflict.statut].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleView(conflict)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(conflict)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteConfirm(conflict)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4 text-xs sm:text-sm text-muted-foreground">
          <p>{filteredConflicts.length} cas affichés</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="text-xs">
              Précédent
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Suivant
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouveau conflit minier</DialogTitle>
            <DialogDescription>
              Enregistrer un nouveau cas de conflit dans la base de données
            </DialogDescription>
          </DialogHeader>
          <ConflictForm />
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveNew} disabled={!isFormValid}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le conflit</DialogTitle>
            <DialogDescription>
              Modifier les informations du conflit {selectedConflict?.reference}
            </DialogDescription>
          </DialogHeader>
          <ConflictForm />
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveEdit} disabled={!isFormValid}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg mx-4">
          <DialogHeader>
            <DialogTitle>Détails du conflit {selectedConflict?.reference}</DialogTitle>
            <DialogDescription>
              Ouvert le {selectedConflict?.dateOuverture ? formatDate(selectedConflict.dateOuverture) : ''}
            </DialogDescription>
          </DialogHeader>
          {selectedConflict && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{selectedConflict.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Zone</p>
                  <p className="font-medium">{selectedConflict.zone}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Parties impliquées</p>
                <p className="font-medium">{selectedConflict.parties}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                <Badge variant={statusConfig[selectedConflict.statut].variant}>
                  {statusConfig[selectedConflict.statut].label}
                </Badge>
              </div>
              {selectedConflict.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{selectedConflict.description}</p>
                </div>
              )}
              {selectedConflict.decision && (
                <div>
                  <p className="text-sm text-muted-foreground">Décision</p>
                  <p className="font-medium">{selectedConflict.decision}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Fermer</Button>
            <Button onClick={() => { setIsViewDialogOpen(false); if (selectedConflict) handleEdit(selectedConflict); }}>
              <Pencil className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le conflit {selectedConflict?.reference} ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
