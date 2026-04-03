import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { canAdd } from "@/lib/permissions"

async function getRole(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) return null
  return (session.user as { role?: string })?.role ?? "agent"
}

// GET /api/documents — liste (sans le contenu binaire)
export async function GET(req: NextRequest) {
  const role = await getRole(req)
  if (!role) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const documents = await prisma.document.findMany({
    select: {
      id: true,
      nom: true,
      categorie: true,
      dateEcheance: true,
      taille: true,
      mimeType: true,
      createdAt: true,
    },
    orderBy: { dateEcheance: "asc" },
  })

  return NextResponse.json(documents)
}

// POST /api/documents — upload (multipart/form-data)
export async function POST(req: NextRequest) {
  const role = await getRole(req)
  if (!role) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  if (!canAdd(role)) return NextResponse.json({ error: "Accès refusé" }, { status: 403 })

  const formData = await req.formData()
  const nom = formData.get("nom") as string | null
  const categorie = formData.get("categorie") as string | null
  const dateEcheance = formData.get("dateEcheance") as string | null
  const fichier = formData.get("fichier") as File | null

  if (!nom || !categorie || !dateEcheance || !fichier) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 })
  }

  const buffer = Buffer.from(await fichier.arrayBuffer())

  const doc = await prisma.document.create({
    data: {
      nom,
      categorie,
      dateEcheance: new Date(dateEcheance),
      contenu: buffer,
      taille: buffer.byteLength,
      mimeType: fichier.type || "application/octet-stream",
    },
    select: {
      id: true, nom: true, categorie: true,
      dateEcheance: true, taille: true, mimeType: true, createdAt: true,
    },
  })

  return NextResponse.json(doc, { status: 201 })
}
