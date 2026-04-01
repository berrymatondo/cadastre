import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_6jKorn4YUIRe@ep-dry-math-agmjjbbe-pooler.c-2.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require",
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const titresData = [
  { id: "t1",  numero: "I",     titre: "DISPOSITIONS GÉNÉRALES" },
  { id: "t2",  numero: "II",    titre: "DE L'ADMINISTRATION MINIÈRE ET DU CADASTRE MINIER" },
  { id: "t3",  numero: "III",   titre: "DES DROITS MINIERS ET DES AUTORISATIONS DE CARRIÈRES" },
  { id: "t4",  numero: "IV",    titre: "DES RÉGIMES FISCAL ET DOUANIER" },
  { id: "t16", numero: "XVI",   titre: "DES DISPOSITIONS TRANSITOIRES" },
  { id: "t17", numero: "XVII",  titre: "DES DISPOSITIONS ABROGATOIRES ET FINALES" },
]

// Mapping chapitre id → titre id
const chapTitreMap: Record<string, string> = {
  ch1:    "t1",
  ch2:    "t2",
  ch3:    "t3",
  ch4:    "t3",
  ch5:    "t4",
  ch_p3:  "t16",
  ch_p4:  "t16",
  ch_p17: "t17",
}

async function main() {
  console.log("Seeding titres du Code Minier…")

  for (const t of titresData) {
    await prisma.codeMinierTitre.upsert({
      where: { id: t.id },
      update: { numero: t.numero, titre: t.titre },
      create: { id: t.id, numero: t.numero, titre: t.titre },
    })
    console.log(`  ✓ Titre ${t.numero} — ${t.titre}`)
  }

  console.log("\nLiaison chapitres → titres…")
  for (const [chapId, titreId] of Object.entries(chapTitreMap)) {
    const updated = await prisma.codeMinierChapitre.updateMany({
      where: { id: chapId },
      data: { titreId },
    })
    if (updated.count > 0) {
      console.log(`  ✓ Chapitre ${chapId} → Titre ${titreId}`)
    } else {
      console.log(`  ⚠ Chapitre ${chapId} introuvable (pas encore seeded ?)`)
    }
  }

  console.log("\nDone.")
}

main()
  .catch(console.error)
  .finally(() => pool.end())
