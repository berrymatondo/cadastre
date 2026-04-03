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

  return new Response(doc.contenu, {
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(doc.nom)}"`,
      "Content-Length": doc.contenu.byteLength.toString(),
    },
  })
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
