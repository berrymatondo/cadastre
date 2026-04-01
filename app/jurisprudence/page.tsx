"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
} from "@/components/ui/dialog"
import { Search, Calendar, FileText, ArrowRight, Scale, Plus, Pencil, Trash2, X } from "lucide-react"

interface JurisprudenceCase {
  id: string
  reference: string
  titre: string
  juridiction: string
  date: string
  resume: string
  matieres: string[]
  importance: "haute" | "moyenne" | "normale"
  texteComplet?: string
}

const initialCases: JurisprudenceCase[] = [
  {
    id: "1",
    reference: "Arrêt n°2023-045/CS",
    titre: "Mining Corp c/ État - Conditions d'octroi des permis",
    juridiction: "Cour Suprême, Chambre Administrative",
    date: "2023-11-22",
    resume: "La Cour précise l'interprétation des conditions d'octroi des permis d'exploitation, notamment concernant la démonstration des capacités financières qui doivent être évaluées au moment de la demande et non de manière rétroactive.",
    matieres: ["Permis d'exploitation", "Capacités financières"],
    importance: "haute",
    texteComplet: "VU la requête de Mining Corp en date du 15 mars 2023...",
  },
  {
    id: "2",
    reference: "Arrêt n°2023-032/CA",
    titre: "Communauté X c/ Société Y - Conflit foncier",
    juridiction: "Cour d'Appel de Lubumbashi",
    date: "2023-09-15",
    resume: "Confirmation du principe de priorité des droits fonciers coutumiers antérieurs à l'attribution d'un titre minier, sous réserve de leur établissement par des preuves tangibles.",
    matieres: ["Conflit foncier", "Droits coutumiers"],
    importance: "haute",
  },
  {
    id: "3",
    reference: "Jugement n°2024-012/TGI",
    titre: "État c/ Société Z - Fraude fiscale",
    juridiction: "Tribunal de Grande Instance",
    date: "2024-02-08",
    resume: "Condamnation pour non-déclaration de production minière et évasion fiscale. Application des pénalités prévues au Code minier.",
    matieres: ["Fiscalité", "Sanctions pénales"],
    importance: "moyenne",
  },
  {
    id: "4",
    reference: "Arrêt n°2022-078/CS",
    titre: "Entreprise W c/ Administration - Retrait de permis",
    juridiction: "Cour Suprême",
    date: "2022-06-30",
    resume: "Annulation d'une décision de retrait de permis pour vice de procédure. Rappel des obligations de notification et de motivation préalables.",
    matieres: ["Retrait de permis", "Procédure administrative"],
    importance: "normale",
  },
]

const importanceConfig = {
  haute: { label: "Haute", className: "bg-destructive/10 text-destructive" },
  moyenne: { label: "Moyenne", className: "bg-chart-3/10 text-chart-3" },
  normale: { label: "Normale", className: "bg-muted text-muted-foreground" },
}

const juridictions = [
  "Cour Suprême",
  "Cour Suprême, Chambre Administrative",
  "Cour d'Appel de Lubumbashi",
  "Cour d'Appel de Kinshasa",
  "Tribunal de Grande Instance",
  "Conseil d'État",
]

const matieresOptions = [
  "Permis d'exploitation",
  "Permis de recherche",
  "Capacités financières",
  "Conflit foncier",
  "Droits coutumiers",
  "Fiscalité",
  "Sanctions pénales",
  "Retrait de permis",
  "Procédure administrative",
  "Environnement",
  "Redevances",
  "Chevauchement",
]

interface CaseFormData {
  reference: string
  titre: string
  juridiction: string
  date: string
  resume: string
  matieres: string[]
  importance: "haute" | "moyenne" | "normale"
  texteComplet: string
}

const emptyFormData: CaseFormData = {
  reference: "",
  titre: "",
  juridiction: "",
  date: "",
  resume: "",
  matieres: [],
  importance: "normale",
  texteComplet: "",
}

export default function JurisprudencePage() {
  const [cases, setCases] = useState<JurisprudenceCase[]>(initialCases)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCase, setSelectedCase] = useState<JurisprudenceCase | null>(null)
  const [formData, setFormData] = useState<CaseFormData>(emptyFormData)
  const [newMatiere, setNewMatiere] = useState("")

  const filteredCases = cases.filter(
    (c) =>
      c.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.resume.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.matieres.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleAddNew = () => {
    setFormData({
      ...emptyFormData,
      date: new Date().toISOString().split('T')[0],
    })
    setIsAddDialogOpen(true)
  }

  const handleEdit = (cas: JurisprudenceCase) => {
    setSelectedCase(cas)
    setFormData({
      reference: cas.reference,
      titre: cas.titre,
      juridiction: cas.juridiction,
      date: cas.date,
      resume: cas.resume,
      matieres: [...cas.matieres],
      importance: cas.importance,
      texteComplet: cas.texteComplet || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleView = (cas: JurisprudenceCase) => {
    setSelectedCase(cas)
    setIsViewDialogOpen(true)
  }

  const handleDeleteConfirm = (cas: JurisprudenceCase) => {
    setSelectedCase(cas)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveNew = () => {
    const newCase: JurisprudenceCase = {
      id: Date.now().toString(),
      ...formData,
      texteComplet: formData.texteComplet || undefined,
    }
    setCases([newCase, ...cases])
    setIsAddDialogOpen(false)
    setFormData(emptyFormData)
  }

  const handleSaveEdit = () => {
    if (!selectedCase) return
    setCases(cases.map(c => 
      c.id === selectedCase.id 
        ? { 
            ...c, 
            ...formData,
            texteComplet: formData.texteComplet || undefined,
          } 
        : c
    ))
    setIsEditDialogOpen(false)
    setSelectedCase(null)
    setFormData(emptyFormData)
  }

  const handleDelete = () => {
    if (!selectedCase) return
    setCases(cases.filter(c => c.id !== selectedCase.id))
    setIsDeleteDialogOpen(false)
    setSelectedCase(null)
  }

  const addMatiere = (matiere: string) => {
    if (matiere && !formData.matieres.includes(matiere)) {
      setFormData({ ...formData, matieres: [...formData.matieres, matiere] })
    }
    setNewMatiere("")
  }

  const removeMatiere = (matiere: string) => {
    setFormData({ ...formData, matieres: formData.matieres.filter(m => m !== matiere) })
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR')
  }

  const isFormValid = formData.reference && formData.titre && formData.juridiction && formData.date && formData.resume

  const CaseForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reference">Référence</Label>
          <Input
            id="reference"
            value={formData.reference}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            placeholder="Arrêt n°XXXX-XXX/XX"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date de la décision</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="titre">Titre / Intitulé</Label>
        <Input
          id="titre"
          value={formData.titre}
          onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
          placeholder="Partie A c/ Partie B - Objet du litige"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="juridiction">Juridiction</Label>
          <Select value={formData.juridiction} onValueChange={(value) => setFormData({ ...formData, juridiction: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une juridiction" />
            </SelectTrigger>
            <SelectContent>
              {juridictions.map((j) => (
                <SelectItem key={j} value={j}>{j}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="importance">Importance</Label>
          <Select value={formData.importance} onValueChange={(value: "haute" | "moyenne" | "normale") => setFormData({ ...formData, importance: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="haute">Haute</SelectItem>
              <SelectItem value="moyenne">Moyenne</SelectItem>
              <SelectItem value="normale">Normale</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="resume">Résumé</Label>
        <Textarea
          id="resume"
          value={formData.resume}
          onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
          placeholder="Résumé de la décision et des points de droit..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Matières / Thématiques</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.matieres.map((matiere) => (
            <Badge key={matiere} variant="secondary" className="gap-1">
              {matiere}
              <button type="button" onClick={() => removeMatiere(matiere)} className="ml-1 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Select value="" onValueChange={(value) => addMatiere(value)}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Ajouter une matière..." />
            </SelectTrigger>
            <SelectContent>
              {matieresOptions.filter(m => !formData.matieres.includes(m)).map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 mt-2">
          <Input
            value={newMatiere}
            onChange={(e) => setNewMatiere(e.target.value)}
            placeholder="Ou saisir une nouvelle matière..."
            className="flex-1"
          />
          <Button type="button" variant="outline" size="sm" onClick={() => addMatiere(newMatiere)}>
            Ajouter
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="texteComplet">Texte complet (optionnel)</Label>
        <Textarea
          id="texteComplet"
          value={formData.texteComplet}
          onChange={(e) => setFormData({ ...formData, texteComplet: e.target.value })}
          placeholder="Texte intégral de la décision..."
          rows={5}
        />
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          title="Jurisprudence"
          subtitle="Base de données des décisions de justice"
        />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
            {/* Search */}
            <Card className="bg-card border-border">
              <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-foreground flex items-center gap-2 text-base sm:text-lg">
                      <Scale className="w-4 h-4 sm:w-5 sm:h-5" />
                      Recherche jurisprudentielle
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Consultez les décisions de justice relatives au droit minier
                    </CardDescription>
                  </div>
                  <Button size="sm" className="w-full sm:w-auto" onClick={handleAddNew}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle décision
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Rechercher par titre, matière ou contenu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-background text-sm"
                    />
                  </div>
                  <Button variant="outline" className="shrink-0">Filtres avancés</Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-3 sm:space-y-4">
              <p className="text-xs sm:text-sm text-muted-foreground">
                {filteredCases.length} décision(s) trouvée(s)
              </p>

              {filteredCases.map((cas) => (
                <Card key={cas.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-3 sm:p-6">
                    <div className="flex items-start justify-between gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">{cas.reference}</Badge>
                          <Badge className={`${importanceConfig[cas.importance].className} text-xs`}>
                            {importanceConfig[cas.importance].label}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base line-clamp-2">
                          {cas.titre}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                          {cas.resume}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            <span className="hidden sm:inline">{cas.juridiction}</span>
                            <span className="sm:hidden">{cas.juridiction.split(',')[0]}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(cas.date)}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                          {cas.matieres.map((matiere) => (
                            <Badge key={matiere} variant="secondary" className="text-[10px] sm:text-xs">
                              {matiere}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleView(cas)}>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(cas)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteConfirm(cas)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle décision de jurisprudence</DialogTitle>
            <DialogDescription>
              Enregistrer une nouvelle décision dans la base de données
            </DialogDescription>
          </DialogHeader>
          <CaseForm />
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveNew} disabled={!isFormValid}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la décision</DialogTitle>
            <DialogDescription>
              Modifier les informations de {selectedCase?.reference}
            </DialogDescription>
          </DialogHeader>
          <CaseForm />
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveEdit} disabled={!isFormValid}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCase?.reference}</DialogTitle>
            <DialogDescription>
              {selectedCase?.titre}
            </DialogDescription>
          </DialogHeader>
          {selectedCase && (
            <div className="space-y-4 mt-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={importanceConfig[selectedCase.importance].className}>
                  Importance {importanceConfig[selectedCase.importance].label}
                </Badge>
                {selectedCase.matieres.map((matiere) => (
                  <Badge key={matiere} variant="secondary">{matiere}</Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Juridiction</p>
                  <p className="font-medium">{selectedCase.juridiction}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(selectedCase.date)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Résumé</p>
                <p className="text-foreground">{selectedCase.resume}</p>
              </div>
              {selectedCase.texteComplet && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Texte complet</p>
                  <div className="bg-muted/50 p-4 rounded-lg max-h-48 overflow-y-auto">
                    <p className="text-sm whitespace-pre-wrap">{selectedCase.texteComplet}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Fermer</Button>
            <Button onClick={() => { setIsViewDialogOpen(false); if (selectedCase) handleEdit(selectedCase); }}>
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
              Êtes-vous sûr de vouloir supprimer la décision {selectedCase?.reference} ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
