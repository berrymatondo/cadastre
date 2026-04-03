import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { canEdit } from "@/lib/permissions"

// Valeurs par défaut — insérées si absentes de la base
const DEFAULTS = [
  { cle: "semaines_alerte_documents", valeur: "4", label: "Alerte documents (semaines avant échéance)" },
  { cle: "semaines_alerte_actions",   valeur: "4", label: "Alerte actions (semaines avant échéance)" },
]

async function seedDefaults() {
  for (const d of DEFAULTS) {
    await prisma.parametre.upsert({
      where: { cle: d.cle },
      update: {},
      create: d,
    })
  }
}

async function getRole(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) return null
  return (session.user as { role?: string })?.role ?? "agent"
}

// GET /api/parametres — liste tous les paramètres
export async function GET(req: NextRequest) {
  const role = await getRole(req)
  if (!role) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  await seedDefaults()
  const params = await prisma.parametre.findMany({ orderBy: { cle: "asc" } })
  return NextResponse.json(params)
}

// PATCH /api/parametres — mettre à jour une ou plusieurs valeurs
// Body: { cle: string, valeur: string }[]
export async function PATCH(req: NextRequest) {
  const role = await getRole(req)
  if (!role) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  if (!canEdit(role)) return NextResponse.json({ error: "Accès refusé" }, { status: 403 })

  const updates: { cle: string; valeur: string }[] = await req.json()

  await Promise.all(
    updates.map(({ cle, valeur }) =>
      prisma.parametre.update({ where: { cle }, data: { valeur } })
    )
  )

  const params = await prisma.parametre.findMany({ orderBy: { cle: "asc" } })
  return NextResponse.json(params)
}
