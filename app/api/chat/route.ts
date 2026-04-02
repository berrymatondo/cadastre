import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import prisma from "@/lib/prisma"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Extrait les mots-clés significatifs d'une question
function extractKeywords(text: string): string[] {
  const stopwords = new Set([
    "le", "la", "les", "de", "du", "des", "un", "une", "et", "en", "à", "au",
    "aux", "par", "pour", "sur", "dans", "est", "sont", "que", "qui", "quoi",
    "quel", "quelle", "quels", "quelles", "comment", "pourquoi", "quand", "où",
    "je", "tu", "il", "elle", "nous", "vous", "ils", "elles", "me", "se", "lui",
    "mon", "ton", "son", "ma", "ta", "sa", "mes", "tes", "ses", "ce", "cet",
    "cette", "ces", "plus", "très", "bien", "mais", "ou", "donc", "or", "ni",
    "car", "si", "ne", "pas", "avec", "sans", "tout", "tous", "toute", "toutes",
    "doit", "peut", "avoir", "faire", "être", "selon", "article", "titre",
  ])
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopwords.has(w))
    .slice(0, 12)
}

async function searchAll(question: string) {
  const keywords = extractKeywords(question)
  if (keywords.length === 0) {
    return { codeMinier: [], reglementMinier: [], conflits: [], jurisprudences: [] }
  }

  const containsAny = (field: string) =>
    keywords.map((kw) => ({ [field]: { contains: kw, mode: "insensitive" as const } }))

  const [codeMinier, reglementMinier, conflits, jurisprudences] = await Promise.all([
    // Code Minier — articles + paragraphes
    prisma.codeMinierArticle.findMany({
      where: {
        OR: [
          ...containsAny("titre"),
          ...containsAny("contenu"),
          ...containsAny("introduction"),
          { keywords: { hasSome: keywords } },
        ],
      },
      include: {
        paragraphes: { orderBy: { ordre: "asc" }, take: 5 },
        chapitre: { select: { titre: true, numero: true } },
      },
      take: 5,
    }),

    // Règlement Minier — articles + paragraphes
    prisma.reglementArticle.findMany({
      where: {
        OR: [
          ...containsAny("titre"),
          { keywords: { hasSome: keywords } },
        ],
      },
      include: {
        paragraphes: { orderBy: { ordre: "asc" }, take: 5 },
        chapitre: { select: { titre: true, numero: true } },
      },
      take: 4,
    }),

    // Conflits miniers
    prisma.conflit.findMany({
      where: {
        OR: [
          ...containsAny("type"),
          ...containsAny("parties"),
          ...containsAny("zone"),
          ...containsAny("description"),
          ...containsAny("decision"),
        ],
      },
      take: 3,
    }),

    // Jurisprudences
    prisma.jurisprudence.findMany({
      where: {
        OR: [
          ...containsAny("titre"),
          ...containsAny("resume"),
          ...containsAny("texteComplet"),
          ...containsAny("juridiction"),
          { matieres: { hasSome: keywords } },
        ],
      },
      orderBy: { importance: "asc" }, // haute < moyenne < normale (tri alphabétique inverse)
      take: 3,
    }),
  ])

  return { codeMinier, reglementMinier, conflits, jurisprudences }
}

type SearchResult = Awaited<ReturnType<typeof searchAll>>

function buildContext(results: SearchResult): string {
  const parts: string[] = []

  if (results.codeMinier.length > 0) {
    parts.push("=== CODE MINIER ===")
    for (const a of results.codeMinier) {
      parts.push(`\n[Art. ${a.numero} — ${a.titre}] (Chap. ${a.chapitre.numero} — ${a.chapitre.titre})`)
      if (a.introduction) parts.push(a.introduction)
      if (a.contenu) parts.push(a.contenu)
      for (const p of a.paragraphes) {
        parts.push(`  §${p.numero} ${p.contenu}`)
        if (p.note) parts.push(`  Note: ${p.note}`)
      }
    }
  }

  if (results.reglementMinier.length > 0) {
    parts.push("\n=== RÈGLEMENT MINIER ===")
    for (const a of results.reglementMinier) {
      parts.push(`\n[Art. ${a.numero} — ${a.titre}] (Chap. ${a.chapitre.numero} — ${a.chapitre.titre})`)
      for (const p of a.paragraphes) {
        parts.push(`  §${p.numero} ${p.contenu}`)
        if (p.note) parts.push(`  Note: ${p.note}`)
      }
    }
  }

  if (results.conflits.length > 0) {
    parts.push("\n=== CONFLITS MINIERS ===")
    for (const c of results.conflits) {
      parts.push(`\n[${c.reference}] ${c.type} — Zone: ${c.zone}`)
      parts.push(`  Parties: ${c.parties}`)
      parts.push(`  Statut: ${c.statut} | Ouvert le: ${c.dateOuverture.toLocaleDateString("fr-FR")}`)
      if (c.description) parts.push(`  Description: ${c.description}`)
      if (c.decision) parts.push(`  Décision: ${c.decision}`)
    }
  }

  if (results.jurisprudences.length > 0) {
    parts.push("\n=== JURISPRUDENCE ===")
    for (const j of results.jurisprudences) {
      parts.push(`\n[${j.reference}] ${j.titre}`)
      parts.push(`  Juridiction: ${j.juridiction} | Date: ${j.date.toLocaleDateString("fr-FR")} | Importance: ${j.importance}`)
      parts.push(`  Résumé: ${j.resume}`)
      if (j.texteComplet) parts.push(`  Texte: ${j.texteComplet.slice(0, 600)}...`)
    }
  }

  return parts.join("\n")
}

function buildSources(results: SearchResult): string[] {
  return [
    ...results.codeMinier.map((a) => `Code minier Art. ${a.numero} — ${a.titre}`),
    ...results.reglementMinier.map((a) => `Règlement minier Art. ${a.numero} — ${a.titre}`),
    ...results.conflits.map((c) => `Conflit ${c.reference} — ${c.type}`),
    ...results.jurisprudences.map((j) => `Jurisprudence ${j.reference} — ${j.titre}`),
  ]
}

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json() as {
      message: string
      history: { role: "user" | "assistant"; content: string }[]
    }

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message vide" }, { status: 400 })
    }

    const results = await searchAll(message)
    const context = buildContext(results)
    const hasContext = Object.values(results).some((r) => r.length > 0)

    const systemPrompt = `Tu es un assistant juridique expert en droit minier de la République Démocratique du Congo, spécialisé dans le Code minier, le Règlement minier, la jurisprudence et les conflits miniers.

Tu réponds en français, de façon claire, précise et structurée. Tu cites toujours tes sources (article, référence de conflit, décision de jurisprudence).

${hasContext
  ? `Voici les extraits pertinents issus de la base de données juridique :\n\n${context}\n\nBase ta réponse principalement sur ces extraits. Si un point n'est pas couvert, précise-le clairement.`
  : `Aucun extrait spécifique n'a été trouvé dans la base de données pour cette question. Réponds à partir de tes connaissances générales du droit minier congolais en le signalant.`
}`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...(history || []).slice(-10),
        { role: "user", content: message },
      ],
      temperature: 0.3,
      max_tokens: 1200,
    })

    const reply = completion.choices[0]?.message?.content ?? "Désolé, je n'ai pas pu générer une réponse."

    return NextResponse.json({ reply, sources: buildSources(results) })
  } catch (err) {
    console.error("[/api/chat]", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
