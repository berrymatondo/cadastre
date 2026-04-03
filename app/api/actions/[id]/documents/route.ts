import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

async function getRole(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) return null
  return (session.user as { role?: string })?.role ?? "agent"
}

// GET /api/actions/[id]/documents — liste des docs liés à cette action
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const role = await getRole(req)
  if (!role) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { id } = await params
  const docs = await prisma.document.findMany({
    where: { actionId: id },
    select: { id: true, nom: true, mimeType: true, taille: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(docs)
}

// POST /api/actions/[id]/documents — uploader un fichier lié à cette action
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const role = await getRole(req)
  if (!role) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { id } = await params

  // Vérifier que l'action existe
  const action = await prisma.action.findUnique({ where: { id }, select: { id: true } })
  if (!action) return NextResponse.json({ error: "Action introuvable" }, { status: 404 })

  const formData = await req.formData()
  const fichier = formData.get("fichier") as File | null

  if (!fichier) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 })

  const buffer = Buffer.from(await fichier.arrayBuffer())

  const doc = await prisma.document.create({
    data: {
      nom: fichier.name,
      categorie: "action",
      // Date d'échéance fictive (champ obligatoire du modèle) : dans 1 an
      dateEcheance: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      contenu: buffer,
      taille: buffer.byteLength,
      mimeType: fichier.type || "application/octet-stream",
      actionId: id,
    },
    select: { id: true, nom: true, mimeType: true, taille: true, createdAt: true },
  })

  return NextResponse.json(doc, { status: 201 })
}

// DELETE /api/actions/[id]/documents?docId=xxx — supprimer un doc
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const role = await getRole(req)
  if (!role) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { id } = await params
  const docId = new URL(req.url).searchParams.get("docId")
  if (!docId) return NextResponse.json({ error: "docId manquant" }, { status: 400 })

  await prisma.document.delete({ where: { id: docId, actionId: id } })

  return NextResponse.json({ success: true })
}
