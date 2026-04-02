import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

async function requireAdmin(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  const role = (session?.user as { role?: string } | undefined)?.role
  if (!session || role !== "admin") return null
  return session
}

// PATCH /api/admin/users/[id] — modifier le rôle
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin(req)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  const { id } = await params
  const { role } = await req.json()

  const validRoles = ["admin", "manager", "agent"]
  if (!role || !validRoles.includes(role)) {
    return NextResponse.json({ error: "Rôle invalide" }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  })

  return NextResponse.json(user)
}

// DELETE /api/admin/users/[id] — supprimer un utilisateur
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin(req)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  const { id } = await params

  // Supprimer sessions et comptes liés d'abord
  await prisma.session.deleteMany({ where: { userId: id } })
  await prisma.account.deleteMany({ where: { userId: id } })
  await prisma.user.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
