import { defineConfig } from "prisma/config";

const DATABASE_URL =
  "postgresql://neondb_owner:npg_6jKorn4YUIRe@ep-dry-math-agmjjbbe-pooler.c-2.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: DATABASE_URL,
  },
});
