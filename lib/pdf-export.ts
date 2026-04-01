"use client"

import type { jsPDF as JsPDFType } from "jspdf"

// ─── Types partagés ───────────────────────────────────────────────────────────

export interface PdfParagraphe {
  numero: string
  contenu: string
  note?: string
}

export interface PdfArticle {
  numero: string
  titre: string
  modification?: string
  introduction?: string
  contenu?: string
  paragraphes?: PdfParagraphe[]
  keywords?: string[]
}

export interface PdfSection {
  numero: string
  titre: string
  articles: PdfArticle[]
}

export interface PdfChapitre {
  numero: string
  titre: string
  titreParent?: string   // Titre/Livre parent (règlement)
  sections?: PdfSection[]
  articles?: PdfArticle[] // articles directs sans section (règlement)
}

// ─── Helpers internes ─────────────────────────────────────────────────────────

const MARGIN = 20
const PAGE_W = 210
const CONTENT_W = PAGE_W - MARGIN * 2
const LINE_H = 6

function loadJsPdf(): Promise<typeof JsPDFType> {
  return import("jspdf").then((m) => m.jsPDF)
}

/** Découpe le texte en lignes et retourne la nouvelle position Y. */
function writeText(
  doc: JsPDFType,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize = 10,
  style: "normal" | "bold" | "italic" = "normal",
): number {
  doc.setFontSize(fontSize)
  doc.setFont("helvetica", style)
  const lines = doc.splitTextToSize(text, maxWidth) as string[]
  lines.forEach((line: string) => {
    if (y > 275) {
      doc.addPage()
      y = MARGIN
    }
    doc.text(line, x, y)
    y += LINE_H
  })
  return y
}

function addHeader(doc: JsPDFType, titre: string, sous: string) {
  doc.setFillColor(30, 64, 175)
  doc.rect(0, 0, PAGE_W, 22, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text(titre, MARGIN, 10)
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.text(sous, MARGIN, 17)
  doc.setTextColor(0, 0, 0)
  return 30
}

function addFooter(doc: JsPDFType) {
  const total = doc.getNumberOfPages()
  for (let i = 1; i <= total; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(120, 120, 120)
    doc.line(MARGIN, 288, PAGE_W - MARGIN, 288)
    doc.text("République Démocratique du Congo — Cadastre Minier", MARGIN, 293)
    doc.text(`Page ${i} / ${total}`, PAGE_W - MARGIN, 293, { align: "right" })
    doc.setTextColor(0, 0, 0)
  }
}

function renderArticle(doc: JsPDFType, art: PdfArticle, y: number): number {
  if (y > 255) { doc.addPage(); y = MARGIN }

  // Titre article
  doc.setFillColor(239, 246, 255)
  doc.rect(MARGIN, y - 4, CONTENT_W, 8, "F")
  y = writeText(doc, `Article ${art.numero} — ${art.titre}`, MARGIN + 2, y, CONTENT_W - 4, 11, "bold")
  y += 2

  if (art.modification) {
    y = writeText(doc, `(${art.modification})`, MARGIN + 2, y, CONTENT_W - 4, 8, "italic")
    y += 1
  }
  if (art.introduction) {
    y = writeText(doc, art.introduction, MARGIN + 2, y, CONTENT_W - 4, 10, "italic")
    y += 2
  }
  if (art.contenu) {
    y = writeText(doc, art.contenu, MARGIN + 2, y, CONTENT_W - 4, 10)
    y += 2
  }
  if (art.paragraphes) {
    for (const para of art.paragraphes) {
      const bullet = para.numero ? `${para.numero}.  ` : "    "
      y = writeText(doc, bullet + para.contenu, MARGIN + 6, y, CONTENT_W - 6, 9)
      if (para.note) {
        y = writeText(doc, `Note : ${para.note}`, MARGIN + 10, y, CONTENT_W - 10, 8, "italic")
        y += 1
      }
    }
  }
  return y + 4
}

// ─── Export article ───────────────────────────────────────────────────────────

export async function exportArticlePdf(
  art: PdfArticle,
  source: "Code Minier" | "Règlement Minier",
  context?: string,
) {
  const JsPDF = await loadJsPdf()
  const doc = new JsPDF({ orientation: "portrait", unit: "mm", format: "a4" })

  let y = addHeader(doc, source, context ?? `Article ${art.numero}`)
  renderArticle(doc, art, y)
  addFooter(doc)

  doc.save(`${source.replace(" ", "-")}_Art${art.numero}.pdf`)
}

// ─── Export section (code minier) ─────────────────────────────────────────────

export async function exportSectionPdf(
  sec: PdfSection,
  chapitreInfo: string,
  source: "Code Minier" | "Règlement Minier",
) {
  const JsPDF = await loadJsPdf()
  const doc = new JsPDF({ orientation: "portrait", unit: "mm", format: "a4" })

  let y = addHeader(doc, source, `${chapitreInfo} — Section ${sec.numero}`)

  // Titre section
  doc.setFillColor(219, 234, 254)
  doc.rect(MARGIN, y - 4, CONTENT_W, 10, "F")
  y = writeText(doc, `Section ${sec.numero} — ${sec.titre}`, MARGIN + 2, y, CONTENT_W - 4, 12, "bold")
  y += 4

  for (const art of sec.articles) {
    y = renderArticle(doc, art, y)
  }

  addFooter(doc)
  doc.save(`${source.replace(" ", "-")}_Sec${sec.numero}.pdf`)
}

// ─── Export chapitre ──────────────────────────────────────────────────────────

export async function exportChapitrePdf(
  ch: PdfChapitre,
  source: "Code Minier" | "Règlement Minier",
) {
  const JsPDF = await loadJsPdf()
  const doc = new JsPDF({ orientation: "portrait", unit: "mm", format: "a4" })

  const subtitle = ch.titreParent
    ? `${ch.titreParent} — Chapitre ${ch.numero}`
    : `Chapitre ${ch.numero}`
  let y = addHeader(doc, source, subtitle)

  // Titre chapitre
  doc.setFillColor(191, 219, 254)
  doc.rect(MARGIN, y - 4, CONTENT_W, 12, "F")
  y = writeText(doc, `Chapitre ${ch.numero} — ${ch.titre}`, MARGIN + 2, y, CONTENT_W - 4, 13, "bold")
  y += 6

  if (ch.sections) {
    for (const sec of ch.sections) {
      if (y > 255) { doc.addPage(); y = MARGIN }
      doc.setFillColor(219, 234, 254)
      doc.rect(MARGIN, y - 4, CONTENT_W, 9, "F")
      y = writeText(doc, `Section ${sec.numero} — ${sec.titre}`, MARGIN + 2, y, CONTENT_W - 4, 11, "bold")
      y += 3
      for (const art of sec.articles) {
        y = renderArticle(doc, art, y)
      }
    }
  }

  if (ch.articles) {
    for (const art of ch.articles) {
      y = renderArticle(doc, art, y)
    }
  }

  addFooter(doc)
  doc.save(`${source.replace(" ", "-")}_Chap${ch.numero}.pdf`)
}
