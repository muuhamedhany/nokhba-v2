import { prisma } from '../lib/prisma';
import { ensureInitialData } from '../lib/autoSeed';

async function main() {
  console.log('[Prisma Seed] Starting database re-population...');
  await ensureInitialData();
  console.log('[Prisma Seed] Completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
