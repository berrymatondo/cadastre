import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

async function getRole(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) return null
  return (session.user as { role?: string })?.role ?? "agent"
}

// PATCH /api/actions/[id] — modifier une action
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const role = await getRole(req)
  if (!role) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { id } = await params
  const { nom, description, assigneeId, dateEcheance, statut } = await req.json()

  if (!nom || !dateEcheance) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 })
  }

  const action = await prisma.action.update({
    where: { id },
    data: {
      nom,
      description: description ?? null,
      assigneeId: assigneeId || null,
      dateEcheance: new Date(dateEcheance),
      statut,
    },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      _count: { select: { documents: true } },
    },
  })

  return NextResponse.json(action)
}

// DELETE /api/actions/[id] — supprimer
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const role = await getRole(req)
  if (!role) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { id } = await params
  await prisma.action.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
