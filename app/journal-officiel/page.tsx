"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Newspaper, Calendar, Download, ExternalLink } from "lucide-react"

interface JournalEntry {
  id: string
  numero: string
  date: string
  titre: string
  categorie: string
  resume: string
  pageDebut: number
  pageFin: number
}

const mockEntries: JournalEntry[] = [
  {
    id: "1",
    numero: "JO n°12/2024",
    date: "15/03/2024",
    titre: "Loi n°024/2024 modifiant et complétant le Code minier",
    categorie: "Lois",
    resume: "Modification des dispositions relatives à la fiscalité minière et aux obligations environnementales des titulaires de droits miniers.",
    pageDebut: 45,
    pageFin: 68,
  },
  {
    id: "2",
    numero: "JO n°11/2024",
    date: "01/03/2024",
    titre: "Décret n°2024-156 portant mesures d'application",
    categorie: "Décrets",
    resume: "Décret précisant les conditions et modalités d'application des nouvelles dispositions du Code minier.",
    pageDebut: 23,
    pageFin: 45,
  },
  {
    id: "3",
    numero: "JO n°10/2024",
    date: "15/02/2024",
    titre: "Arrêté interministériel fixant les taux de redevance",
    categorie: "Arrêtés",
    resume: "Fixation des nouveaux taux de redevance minière applicables aux différentes catégories de substances minérales.",
    pageDebut: 112,
    pageFin: 118,
  },
  {
    id: "4",
    numero: "JO n°09/2024",
    date: "01/02/2024",
    titre: "Ordonnance n°2024-008 portant création de zones protégées",
    categorie: "Ordonnances",
    resume: "Création de nouvelles zones d'exclusion minière pour la protection de l'environnement et des communautés locales.",
    pageDebut: 5,
    pageFin: 12,
  },
  {
    id: "5",
    numero: "JO n°08/2024",
    date: "15/01/2024",
    titre: "Nomination des membres de la Commission minière nationale",
    categorie: "Nominations",
    resume: "Décret portant nomination des membres de la Commission nationale de suivi du secteur minier.",
    pageDebut: 89,
    pageFin: 90,
  },
]

const categories = ["Toutes", "Lois", "Décrets", "Arrêtés", "Ordonnances", "Nominations"]

export default function JournalOfficielPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Toutes")
  const [selectedYear, setSelectedYear] = useState("2024")

  const filteredEntries = mockEntries.filter((entry) => {
    const matchesSearch =
      entry.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.resume.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "Toutes" || entry.categorie === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          title="Journal Officiel"
          subtitle="Publications officielles relatives au secteur minier"
        />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
            {/* Search and Filters */}
            <Card className="bg-card border-border">
              <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
                <CardTitle className="text-foreground flex items-center gap-2 text-base sm:text-lg">
                  <Newspaper className="w-4 h-4 sm:w-5 sm:h-5" />
                  Recherche dans le Journal Officiel
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Source principale des mises à jour légales
                </CardDescription>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
                <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Rechercher par titre ou contenu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-background text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="flex-1 sm:w-32 bg-background text-sm">
                        <SelectValue placeholder="Catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-24 sm:w-28 bg-background text-sm">
                        <SelectValue placeholder="Année" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {filteredEntries.length} publication(s) trouvée(s)
                </p>
                <Button variant="outline" size="sm" className="text-xs">
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Exporter
                </Button>
              </div>

              {filteredEntries.map((entry) => (
                <Card key={entry.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-3 sm:p-6">
                    <div className="flex items-start justify-between gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">{entry.numero}</Badge>
                          <Badge variant="secondary" className="text-xs">{entry.categorie}</Badge>
                          <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {entry.date}
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base line-clamp-2">
                          {entry.titre}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2">
                          {entry.resume}
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Pages {entry.pageDebut} - {entry.pageFin}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 sm:gap-2 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                          <ExternalLink className="w-4 h-4" />
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
    </div>
  )
}
