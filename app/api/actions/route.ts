import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

async function getRole(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) return null
  return (session.user as { role?: string })?.role ?? "agent"
}

// GET /api/actions — liste toutes les actions avec l'assigné
export async function GET(req: NextRequest) {
  const role = await getRole(req)
  if (!role) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const actions = await prisma.action.findMany({
    orderBy: { dateEcheance: "asc" },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      _count: { select: { documents: true } },
    },
  })

  return NextResponse.json(actions)
}

// POST /api/actions — créer une action
export async function POST(req: NextRequest) {
  const role = await getRole(req)
  if (!role) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { nom, description, assigneeId, dateEcheance, statut } = await req.json()

  if (!nom || !dateEcheance) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 })
  }

  const action = await prisma.action.create({
    data: {
      nom,
      description: description ?? null,
      assigneeId: assigneeId || null,
      dateEcheance: new Date(dateEcheance),
      statut: statut ?? "a_faire",
    },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      _count: { select: { documents: true } },
    },
  })

  return NextResponse.json(action, { status: 201 })
}
