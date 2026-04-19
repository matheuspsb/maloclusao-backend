import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./config/database";

async function bootstrap(): Promise<void> {
  await prisma.$connect();

  app.listen(env.PORT, () => {
    console.warn(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
