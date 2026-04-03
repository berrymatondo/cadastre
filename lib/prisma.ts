import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const DATABASE_URL = process.env.DATABASE_URL!;

// Incrémente ce numéro à chaque `prisma db push` / `prisma generate`
// pour forcer la recréation du singleton en développement.
const SCHEMA_VERSION = "6";

declare global {
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var _prismaVersion: string | undefined;
}

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: DATABASE_URL });
  return new PrismaClient({ adapter });
}

function getPrismaClient(): PrismaClient {
  if (globalThis._prisma && globalThis._prismaVersion === SCHEMA_VERSION) {
    return globalThis._prisma;
  }
  // Singleton absent ou version périmée → recréer
  const client = createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalThis._prisma = client;
    globalThis._prismaVersion = SCHEMA_VERSION;
  }
  return client;
}

const prisma = getPrismaClient();

export default prisma;
