import { prisma } from "../src/db.js";

async function main() {
  // upsert = "update if it exists, otherwise create".
  // It makes the seed safe to run many times (idempotent).
  const game = await prisma.game.upsert({
    where: { slug: "valorant" },
    update: {},
    create: { slug: "valorant", name: "Valorant" },
  });
  console.log("Seeded game:", game);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
