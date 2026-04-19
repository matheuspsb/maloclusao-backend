import { defineConfig } from "prisma/config";
import pg from "pg";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrate: {
    async adapter(env) {
      const { PrismaPg } = await import("@prisma/adapter-pg");
      const pool = new pg.Pool({ connectionString: env["DATABASE_URL"] });
      return new PrismaPg(pool);
    },
  },
});
