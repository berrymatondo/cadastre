import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export interface SearchResult {
  id: string
  type: "code" | "reglement" | "jurisprudence" | "conflit"
  title: string
  excerpt: string
  reference: string
  date?: string
  relevance: number
  meta?: string
  href: string
}

function score(text: string, q: string): number {
  if (!text) return 0
  const t = text.toLowerCase()
  const words = q.toLowerCase().split(/\s+/).filter(Boolean)
  let s = 0
  for (const w of words) {
    if (t.includes(w)) s += w.length > 4 ? 20 : 10
  }
  return Math.min(s, 100)
}

function bestScore(fields: string[], q: string): number {
  return Math.min(fields.reduce((acc, f) => acc + score(f, q), 0), 100)
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q = searchParams.get("q")?.trim() ?? ""
  const typesParam = searchParams.get("types") ?? "code,reglement,jurisprudence,conflit"
  const types = typesParam.split(",")

  if (!q) return NextResponse.json([])

  const results: SearchResult[] = []

  // ── Code minier ──────────────────────────────────────────────────────────
  if (types.includes("code")) {
    const articles = await prisma.codeMinierArticle.findMany({
      include: { paragraphes: true, section: true, chapitre: true },
    })
    for (const art of articles) {
      const texts = [
        art.titre,
        art.numero,
        art.introduction ?? "",
        art.contenu ?? "",
        art.keywords.join(" "),
        ...art.paragraphes.map((p) => p.contenu),
      ]
      const s = bestScore(texts, q)
      if (s === 0) continue
      const preview = art.introduction ?? art.paragraphes[0]?.contenu ?? art.contenu ?? ""
      results.push({
        id: `code-${art.id}`,
        type: "code",
        title: `Article ${art.numero} — ${art.titre}`,
        excerpt: preview.slice(0, 200) + (preview.length > 200 ? "…" : ""),
        reference: `Code minier — Chapitre ${art.chapitre?.numero ?? ""}${art.section ? `, Section ${art.section.numero}` : ""}`,
        relevance: s,
        href: `/code-minier?article=${art.id}`,
      })
    }
  }

  // ── Règlement minier ─────────────────────────────────────────────────────
  if (types.includes("reglement")) {
    const articles = await prisma.reglementArticle.findMany({
      include: { paragraphes: true, chapitre: true, titre_rel: true },
    })
    for (const art of articles) {
      const texts = [
        art.titre,
        art.numero,
        art.keywords.join(" "),
        ...art.paragraphes.map((p) => p.contenu),
      ]
      const s = bestScore(texts, q)
      if (s === 0) continue
      const preview = art.paragraphes[0]?.contenu ?? ""
      results.push({
        id: `reglement-${art.id}`,
        type: "reglement",
        title: `Article ${art.numero} — ${art.titre}`,
        excerpt: preview.slice(0, 200) + (preview.length > 200 ? "…" : ""),
        reference: `Règlement minier — Titre ${art.titre_rel?.numero ?? ""}, Chapitre ${art.chapitre?.numero ?? ""}`,
        relevance: s,
        href: `/reglement-minier?article=${art.id}`,
      })
    }
  }

  // ── Jurisprudence ────────────────────────────────────────────────────────
  if (types.includes("jurisprudence")) {
    const cases = await prisma.jurisprudence.findMany()
    for (const c of cases) {
      const texts = [c.titre, c.reference, c.resume, c.juridiction, c.matieres.join(" "), c.texteComplet ?? ""]
      const s = bestScore(texts, q)
      if (s === 0) continue
      results.push({
        id: `jurisprudence-${c.id}`,
        type: "jurisprudence",
        title: c.titre,
        excerpt: c.resume.slice(0, 200) + (c.resume.length > 200 ? "…" : ""),
        reference: c.reference,
        date: c.date.toLocaleDateString("fr-FR"),
        relevance: s,
        meta: c.juridiction,
        href: `/jurisprudence?id=${c.id}`,
      })
    }
  }

  // ── Conflits miniers ─────────────────────────────────────────────────────
  if (types.includes("conflit")) {
    const conflits = await prisma.conflit.findMany()
    for (const c of conflits) {
      const texts = [c.reference, c.type, c.parties, c.zone, c.description ?? "", c.decision ?? ""]
      const s = bestScore(texts, q)
      if (s === 0) continue
      results.push({
        id: `conflit-${c.id}`,
        type: "conflit",
        title: `${c.reference} — ${c.type}`,
        excerpt: (c.description ?? c.parties).slice(0, 200),
        reference: `${c.parties} · ${c.zone}`,
        date: c.dateOuverture.toLocaleDateString("fr-FR"),
        relevance: s,
        meta: c.statut,
        href: `/conflits?id=${c.id}`,
      })
    }
  }

  // Trier par pertinence décroissante
  results.sort((a, b) => b.relevance - a.relevance)

  return NextResponse.json(results.slice(0, 50))
}
