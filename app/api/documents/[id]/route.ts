import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { canDelete } from "@/lib/permissions"

async function getRole(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) return null
  return (session.user as { role?: string })?.role ?? "agent"
}

// GET /api/documents/[id] — télécharger le fichier
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const role = await getRole(req)
  if (!role) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { id } = await params
  const doc = await prisma.document.findUnique({
    where: { id },
    select: { contenu: true, mimeType: true, nom: true },
  })

  if (!doc) return NextResponse.json({ error: "Document introuvable" }, { status: 404 })

  // S'assurer que le nom de fichier a la bonne extension
  const mimeToExt: Record<string, string> = {
    "application/pdf": ".pdf",
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "application/vnd.ms-excel": ".xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
    "application/vnd.ms-powerpoint": ".ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "text/plain": ".txt",
    "application/zip": ".zip",
  }

  const expectedExt = mimeToExt[doc.mimeType] ?? ""
  const nomLower = doc.nom.toLowerCase()
  const filename = expectedExt && !nomLower.endsWith(expectedExt)
    ? `${doc.nom}${expectedExt}`
    : doc.nom

  return new Response(doc.contenu, {
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
      "Content-Length": doc.contenu.byteLength.toString(),
    },
  })
}

// PATCH /api/documents/[id] — modifier nom, catégorie, date d'échéance
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const role = await getRole(req)
  if (!role) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { id } = await params
  const { nom, categorie, dateEcheance } = await req.json()

  if (!nom || !categorie || !dateEcheance) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 })
  }

  const doc = await prisma.document.update({
    where: { id },
    data: { nom, categorie, dateEcheance: new Date(dateEcheance) },
    select: { id: true, nom: true, categorie: true, dateEcheance: true, taille: true, mimeType: true, createdAt: true },
  })

  return NextResponse.json(doc)
}

// DELETE /api/documents/[id] — supprimer (admin uniquement)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const role = await getRole(req)
  if (!role) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  if (!canDelete(role)) return NextResponse.json({ error: "Accès refusé" }, { status: 403 })

  const { id } = await params
  await prisma.document.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
