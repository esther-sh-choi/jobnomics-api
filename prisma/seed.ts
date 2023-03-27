// npx prisma migrate reset
// npx ts-node prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  await prisma.category.createMany({
    data: [
      { name: "Bookmarked" },
      { name: "Applied" },
      { name: "Interviewing" },
      { name: "Interviewed" },
      { name: "Job Offer" },
      { name: "Job Unavailable" },
    ],
  });

  await prisma.checklist.createMany({
    data: [
      { description: "Celebrate your accomplishments" },
      {
        description:
          "Record your interview experience, questions, and your response",
      },
      {
        description: "Send a thank you note to the hiring manager/interviewers",
      },
      {
        description:
          "Remind your references to expect a call or email from the employer",
      },
      { description: "Update your interview prep notes" },
    ],
  });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
