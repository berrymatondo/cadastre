"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Search, FileText, BookOpen, Gavel, Clock, Filter, ChevronDown, AlertTriangle } from "lucide-react"
import type { SearchResult } from "@/app/api/search/route"

// ─── Config par type ──────────────────────────────────────────────────────────

const typeIcons = {
  code:           BookOpen,
  reglement:      FileText,
  jurisprudence:  Gavel,
  conflit:        AlertTriangle,
}

const typeLabels = {
  code:           "Code minier",
  reglement:      "Règlement minier",
  jurisprudence:  "Jurisprudence",
  conflit:        "Conflit minier",
}

const typeBadgeClass: Record<string, string> = {
  code:           "",
  reglement:      "",
  jurisprudence:  "",
  conflit:        "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border-orange-200",
}

const statutLabels: Record<string, string> = {
  en_cours: "En cours",
  resolu:   "Résolu",
  appel:    "En appel",
}

const statutBadgeClass: Record<string, string> = {
  en_cours: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  resolu:   "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  appel:    "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
}

// ─── Composant ────────────────────────────────────────────────────────────────

export function SearchModule() {
  const [query,       setQuery]       = useState("")
  const [results,     setResults]     = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortBy,      setSortBy]      = useState<"relevance" | "date">("relevance")
  const [filters, setFilters] = useState({
    code:          true,
    reglement:     true,
    jurisprudence: true,
    conflit:       true,
  })

  async function handleSearch() {
    if (!query.trim()) return
    setIsSearching(true)
    setHasSearched(true)

    const activeTypes = Object.entries(filters)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(",")

    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&types=${activeTypes}`
      )
      const data: SearchResult[] = await res.json()
      setResults(data)
    } catch {
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const visibleResults = [...results]
    .filter((r) => filters[r.type])
    .sort((a, b) =>
      sortBy === "relevance"
        ? b.relevance - a.relevance
        : (b.date ?? "").localeCompare(a.date ?? "")
    )

  function FilterRow({ suffix }: { suffix: string }) {
    return (
      <>
        {(["code", "reglement", "jurisprudence", "conflit"] as const).map((type) => (
          <div key={type} className="flex items-center gap-2">
            <Checkbox
              id={`filter-${type}-${suffix}`}
              checked={filters[type]}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, [type]: !!checked }))
              }
            />
            <Label htmlFor={`filter-${type}-${suffix}`} className="text-sm cursor-pointer">
              {typeLabels[type]}
            </Label>
          </div>
        ))}
      </>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ── Boîte de recherche ── */}
      <Card className="bg-card border-border">
        <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
          <CardTitle className="text-foreground text-base sm:text-lg">Recherche avancée</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Recherchez dans le Code minier, le Règlement, la jurisprudence et les conflits miniers
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
          <div className="space-y-4">
            {/* Saisie */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Entrez vos termes de recherche…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-9 sm:pl-10 h-10 sm:h-12 text-sm sm:text-base bg-background"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching || !query.trim()}
                className="h-10 sm:h-12 px-4 sm:px-8"
              >
                {isSearching ? "Recherche…" : "Rechercher"}
              </Button>
            </div>

            {/* Filtres mobile (collapsible) */}
            <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen} className="sm:hidden">
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filtres
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3 space-y-3">
                <FilterRow suffix="mobile" />
              </CollapsibleContent>
            </Collapsible>

            {/* Filtres desktop */}
            <div className="hidden sm:flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtres :
              </span>
              <FilterRow suffix="desktop" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Résultats ── */}
      {visibleResults.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="text-foreground text-base sm:text-lg">
                {visibleResults.length} résultat{visibleResults.length > 1 ? "s" : ""}
              </CardTitle>
              <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as "relevance" | "date")}>
                <TabsList className="h-8">
                  <TabsTrigger value="relevance" className="text-xs sm:text-sm px-2 sm:px-3">Pertinence</TabsTrigger>
                  <TabsTrigger value="date" className="text-xs sm:text-sm px-2 sm:px-3">Date</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
            <div className="space-y-3 sm:space-y-4">
              {visibleResults.map((result) => {
                const Icon = typeIcons[result.type]
                return (
                  <div
                    key={result.id}
                    className="p-3 sm:p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-medium text-foreground text-sm sm:text-base line-clamp-2">
                              {result.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-3">
                              {result.excerpt}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs shrink-0 self-start">
                            {result.relevance}%
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-3 text-xs text-muted-foreground">
                          {/* Badge type */}
                          <Badge
                            variant="secondary"
                            className={`text-xs ${typeBadgeClass[result.type]}`}
                          >
                            {typeLabels[result.type]}
                          </Badge>

                          {/* Statut conflit */}
                          {result.type === "conflit" && result.meta && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${statutBadgeClass[result.meta] ?? ""}`}
                            >
                              {statutLabels[result.meta] ?? result.meta}
                            </Badge>
                          )}

                          {/* Juridiction jurisprudence */}
                          {result.type === "jurisprudence" && result.meta && (
                            <span className="italic truncate max-w-50">{result.meta}</span>
                          )}

                          <span className="truncate">{result.reference}</span>

                          {result.date && (
                            <span className="flex items-center gap-1 shrink-0">
                              <Clock className="w-3 h-3" />
                              {result.date}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── État vide ── */}
      {hasSearched && visibleResults.length === 0 && !isSearching && (
        <Card className="bg-card border-border">
          <CardContent className="py-8 sm:py-12 text-center">
            <Search className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium text-sm sm:text-base">Aucun résultat trouvé</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Essayez avec d&apos;autres termes ou vérifiez vos filtres
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
