/**
 * Crée un compte admin initial.
 * Usage: npx tsx prisma/seed-admin.ts
 */
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { admin } from "better-auth/plugins"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_6jKorn4YUIRe@ep-dry-math-agmjjbbe-pooler.c-2.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require",
})
const adapter = new PrismaPg(pool)
const prisma  = new PrismaClient({ adapter })

const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  plugins: [admin({ defaultRole: "agent", adminRole: ["admin"] })],
  secret: "cadastre-minier-a8f3d7c2e1b4f9d6-change-in-production",
  baseURL: "http://localhost:3000",
})

const USERS = [
  { name: "Administrateur",  email: "admin@cadastre.cd",   password: "Admin@2024!",   role: "admin"   },
  { name: "Responsable Mine", email: "manager@cadastre.cd", password: "Manager@2024!", role: "manager" },
  { name: "Agent Minier",    email: "agent@cadastre.cd",   password: "Agent@2024!",   role: "agent"   },
]

async function main() {
  console.log("Seeding utilisateurs…\n")

  for (const u of USERS) {
    try {
      await auth.api.signUpEmail({
        body: { name: u.name, email: u.email, password: u.password },
      })

      // Mettre à jour le rôle directement en DB
      await prisma.user.update({
        where: { email: u.email },
        data:  { role: u.role },
      })

      console.log(`  ✓ ${u.name} (${u.email}) — rôle: ${u.role}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes("already")) {
        console.log(`  ⚠ ${u.email} existe déjà — mise à jour du rôle`)
        await prisma.user.update({ where: { email: u.email }, data: { role: u.role } })
      } else {
        console.error(`  ✗ ${u.email}: ${msg}`)
      }
    }
  }

  console.log("\nComptes créés:")
  console.log("  admin@cadastre.cd   / Admin@2024!")
  console.log("  manager@cadastre.cd / Manager@2024!")
  console.log("  agent@cadastre.cd   / Agent@2024!")
}

main().catch(console.error).finally(() => pool.end())
