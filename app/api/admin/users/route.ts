import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

async function requireAdmin(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  const role = (session?.user as { role?: string } | undefined)?.role
  if (!session || role !== "admin") return null
  return session
}

// GET /api/admin/users — liste des utilisateurs
export async function GET(req: NextRequest) {
  if (!await requireAdmin(req)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true, banned: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(users)
}

// POST /api/admin/users — créer un utilisateur
export async function POST(req: NextRequest) {
  if (!await requireAdmin(req)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  const { name, email, password, role } = await req.json()

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 })
  }

  const validRoles = ["admin", "manager", "agent"]
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: "Rôle invalide" }, { status: 400 })
  }

  // Vérifier si l'email existe déjà
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 })
  }

  // Créer via better-auth (gestion du hash du mot de passe)
  await auth.api.signUpEmail({ body: { name, email, password } })

  // Mettre à jour le rôle
  const user = await prisma.user.update({
    where: { email },
    data: { role },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  return NextResponse.json(user, { status: 201 })
}
