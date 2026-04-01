import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_6jKorn4YUIRe@ep-dry-math-agmjjbbe-pooler.c-2.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require",
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// ─── Conflits ────────────────────────────────────────────────────────────────

const conflitsData = [
  {
    id: "c1",
    reference: "CM-2024-001",
    type: "Foncier",
    parties: "Société ABC vs Communauté Locale X",
    zone: "Kolwezi",
    dateOuverture: new Date("2024-01-15"),
    statut: "en_cours" as const,
    description: "Litige concernant les droits fonciers sur le périmètre minier attribué.",
  },
  {
    id: "c2",
    reference: "CM-2024-002",
    type: "Chevauchement",
    parties: "Mining Corp vs Exploitation Y",
    zone: "Lubumbashi",
    dateOuverture: new Date("2024-02-22"),
    statut: "resolu" as const,
    decision: "Attribution à Mining Corp selon droit de priorité",
    description: "Chevauchement de périmètres détecté lors de la digitalisation.",
  },
  {
    id: "c3",
    reference: "CM-2023-087",
    type: "Environnemental",
    parties: "État vs Société Z",
    zone: "Kipushi",
    dateOuverture: new Date("2023-09-10"),
    statut: "appel" as const,
    decision: "Suspension temporaire - en appel",
    description: "Non-respect des normes environnementales dans le cadre de l'exploitation.",
  },
  {
    id: "c4",
    reference: "CM-2024-003",
    type: "Foncier",
    parties: "Communauté B vs Entreprise W",
    zone: "Likasi",
    dateOuverture: new Date("2024-03-05"),
    statut: "en_cours" as const,
    description: "Revendication de droits coutumiers sur un terrain exploité.",
  },
  {
    id: "c5",
    reference: "CM-2023-065",
    type: "Fiscal",
    parties: "Administration vs Société V",
    zone: "Fungurume",
    dateOuverture: new Date("2023-07-18"),
    statut: "resolu" as const,
    decision: "Paiement des arriérés + pénalités",
    description: "Contentieux fiscal relatif aux redevances minières impayées.",
  },
]

// ─── Jurisprudences ───────────────────────────────────────────────────────────

const jurisprudencesData = [
  {
    id: "j1",
    reference: "Arrêt n°2023-045/CS",
    titre: "Mining Corp c/ État - Conditions d'octroi des permis",
    juridiction: "Cour Suprême, Chambre Administrative",
    date: new Date("2023-11-22"),
    resume: "La Cour précise l'interprétation des conditions d'octroi des permis d'exploitation, notamment concernant la démonstration des capacités financières qui doivent être évaluées au moment de la demande et non de manière rétroactive.",
    matieres: ["Permis d'exploitation", "Capacités financières"],
    importance: "haute" as const,
    texteComplet: "VU la requête de Mining Corp en date du 15 mars 2023...",
  },
  {
    id: "j2",
    reference: "Arrêt n°2023-032/CA",
    titre: "Communauté X c/ Société Y - Conflit foncier",
    juridiction: "Cour d'Appel de Lubumbashi",
    date: new Date("2023-09-15"),
    resume: "Confirmation du principe de priorité des droits fonciers coutumiers antérieurs à l'attribution d'un titre minier, sous réserve de leur établissement par des preuves tangibles.",
    matieres: ["Conflit foncier", "Droits coutumiers"],
    importance: "haute" as const,
  },
  {
    id: "j3",
    reference: "Jugement n°2024-012/TGI",
    titre: "État c/ Société Z - Fraude fiscale",
    juridiction: "Tribunal de Grande Instance",
    date: new Date("2024-02-08"),
    resume: "Condamnation pour non-déclaration de production minière et évasion fiscale. Application des pénalités prévues au Code minier.",
    matieres: ["Fiscalité", "Sanctions pénales"],
    importance: "moyenne" as const,
  },
  {
    id: "j4",
    reference: "Arrêt n°2022-078/CS",
    titre: "Entreprise W c/ Administration - Retrait de permis",
    juridiction: "Cour Suprême",
    date: new Date("2022-06-30"),
    resume: "Annulation d'une décision de retrait de permis pour vice de procédure. Rappel des obligations de notification et de motivation préalables.",
    matieres: ["Retrait de permis", "Procédure administrative"],
    importance: "normale" as const,
  },
]

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seed — Conflits & Jurisprudences…")

  // Conflits
  await prisma.conflit.deleteMany()
  for (const c of conflitsData) {
    await prisma.conflit.create({ data: c })
  }
  console.log(`✅ ${conflitsData.length} conflits insérés`)

  // Jurisprudences
  await prisma.jurisprudence.deleteMany()
  for (const j of jurisprudencesData) {
    await prisma.jurisprudence.create({ data: j })
  }
  console.log(`✅ ${jurisprudencesData.length} jurisprudences insérées`)

  console.log("🎉 Terminé !")
}

main()
  .catch((e) => { console.error("❌", e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect(); await pool.end() })
