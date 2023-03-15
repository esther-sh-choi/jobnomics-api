//  npx prisma migrate reset
// npx ts-node prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function jobs() {
  // prisma.job.deleteMany({});

  await prisma.job.createMany({
    data: [
      {
        title: "Webflow Developer",
        company: "Dieselmatic Digital Inc.",
        description: `About Dieselmatic

        Dieselmatic is a productized digital marketing agency for heavy-duty diesel truck repair shops. We're filling the gap in a growing $12.1b industry that lacks modern solutions for marketing repair services. We are a growing team with ambitious expansion goals for 2022.
        
        At Dieselmatic we adopt our core values in all areas of our careers. We CELEBRATE Each Other’s Excellence, We TRUST Each Other, We RAISE the Bar and We All Just Wanna have FUN! Working at Dieselmatic means being a part of building a career-defining, industry-changing solution.
        
        
        Position Summary
        
        This position is responsible for website design and creation using Webflow. You will be collaborating with the sales team, the website development team and SEO Specialists to clarify the goals of Dieselmatic Partners in order to conceptualize creative and strategic initiatives for unique website design and development. As such, you have the unique ability to clearly and simply communicate technical matters.
        
        
        Why are we hiring a Webflow Developer?
        
        The ultimate purpose of the Webflow Developer is to plan, design, evaluate, develop, test, edit, maintain and document the look and flow of Dieselmatic Partners’ websites.`,
        location: "Canada (Remote)",
        logo: "https://media.licdn.com/dms/image/C560BAQFT0TgSqjoVlw/company-logo_100_100/0/1660000334094?e=1686787200&v=beta&t=yHRQVVuYe3UMdPIAhCEZlpG7awmxAknrG62RZxvOgGI",
        platform: "LinkedIn",
      },
      {
        title: "React Hybrid Developer",
        company: "WallOps",
        description: `Job Title: React Hybrid Developer (Contract)


        Job Summary: We are seeking a React Hybrid Developer with experience in Material UI and Ionic Capacitor to join us on a contract basis. The successful candidate will be responsible for helping to develop web and mobile applications over a minimum 4 to 8 month period.
        
        
        Responsibilities:
        
        Develop applications using Ionic Capacitor and other hybrid or web development frameworks.
        Collaborate with cross-functional teams to define, design, and ship new features.
        Ensure the performance, quality, and responsiveness of applications.
        Identify and correct bottlenecks and fix bugs.
        Help maintain code quality, organization, and automation.
        Stay up-to-date with emerging trends and technologies in web and mobile development.
        
        Requirements:
        
        At least 2 years of experience in React development.
        Comfort programming in TypeScript.
        Experience with Material UI or similar.
        Experience with Ionic Capacitor or similar.
        Understanding of RESTful APIs and experience with API integration.
        Familiarity with Git and Agile development methodologies.
        Excellent problem-solving skills and ability to work independently.
        Strong written and verbal communication skills.
        
        Bonus:
        
        Experience with Redux or similar state management libraries.
        Experience with automated testing frameworks such as Jest or Vitest.
        Knowledge of native iOS and Android development (Swift, Objective-C, Java, Kotlin).
        `,
        location: "Halifax, NS (Remote)",
        platform: "LinkedIn",
      },
      {
        title: "Front-End Developer",
        company: "Priceline",
        description: `Why This Job’s a Big Deal

        As a Software Engineer/Developer, you will collaborate with a small, tight knit team of cutting edge, coding thought leaders who set the strategy for our customer interface in an engaging and ethical way. You will also be working closely with the product and design teams of Priceline. Self-starters are encouraged to explore, fail fast, and build new things, and will be given opportunities to be developed and grow within the company.
        
        In This Role You Will Get To
        Contribute to projects with direct impact on the evolution of Priceline's business.
        Be part of a cross-functional team that experiments, iterates and delivers on product objectives.
        Showcase your expertise in building an engaging user experience.
        Design and develop systems supporting our Hotel, Airline, Rental Car and Vacation Package businesses, that serve hundreds of millions of searches a day.
        Build relationships and interact with Product and Design team members on a modern technology stack grounded in Node.js, with Javascript frameworks and patterns like Redux.
        Optimize our sites for cross-device performance, including mobile, desktop, and tablets.
        Who You Are
        Bachelor’s degree or higher in Computer Science or equivalent.
        5+ years of JavaScript along with experience working on, consumer facing projects.
        Expertise in one or more modern client side JavaScript framework or library (React, Angular, Ember).
        Experienced building applications with Node.js, has an understanding about how Node works and applying common libraries like Express.
        Ability to develop and consume GraphQL APIs.
        Comfort and experience with functional programming.
        Ability to author semantic and accessible markup and style.
        Experience with Styled Components or similar CSS in Javascript framework is a plus.
        Established software development best practices, including writing unit tests and collaborating over programming in peer code review.
        Illustrated history of living the values necessary to Priceline: Customer, Innovation, Team, Accountability and Trust.
        The Right Results, the Right Way is not just a motto at Priceline; it’s a way of life. Unquestionable integrity and ethics is essential.`,
        location: "Toronto, ON (Hybrid)",
        platform: "LinkedIn",
      },
      {
        title: "Technical Lead Frontend Engineer",
        company: "Arteria AI",
        description: `About Arteria AI

        Arteria AI comprises a passionate, rapidly growing team of engineers, designers, data scientists, and lawyers with a vision to build transformative, AI-enabled solutions for the business world. Our mission is to help companies transform how they interact with their most important documents, their contracts.
        
        With our award-winning technology in intelligent contracting, we are looking for enthusiastic individuals who want to grow and win with us!
        
        
        
        The Position
        
        This is an excellent role for anybody interested in making an impact and joining a friendly team driven by innovation and growth.
        
        As a Technical Lead at Arteria AI, you will play an active role in expanding our enterprise SaaS platform for digital contracting.
        
        Our ideal candidate is passionate about software development, design, and the usability of what is being built.
        
        Additionally, we are looking for a candidate with a solid analytical mindset who takes ownership over their work, including developing new features, enhancing existing features, and ensuring their code is thoroughly tested and working correctly. You would also work closely with our product team to create proofs-of-concept and prototypes for potential new features.
        
        
        
        A Week in Your New Life:
        
        You want to spend at least 60% of your time coding being hands on the keyboard also love being creative through tech design and architecture;
        You are a key figure in helping drive and shape our application into the future. Your opinion is valued and sought after;
        You spend time mentoring our awesome Junior developers, nurturing their growth, and helping them succeed;
        You have Developers lean on your designs to help them grow and build stronger features;
        You build awesome reusable code and share those great ideas with your colleagues (they are pumped, by the way!);
        You are a guiding force in helping to unblock the team in delivering its goals;
        You care deeply about testing and how that impacts the team
        You review some great code and provide feedback that improves the team;
        You are a pillar in the construction and design of our architecture; and
        You are engaged and find great purpose in helping the Arteria Team reach new heights.
        
        
        
        What You Bring:
        
        We are hiring engineering leads with the following experience:
        
        B.S. or M.S. degree in Computer Science or a related technical field;
        8+ years of experience building software solutions in a corporate or start-up engineering environment
        7+ years experience developing web applications;
        5+ years using React and Redux along with JavaScript and TypeScript;
        2+ years in a technical leadership role;
        Experience with semantic HTML5 elements and modern CSS techniques;
        A strong background in data structures, algorithms, and design patterns;
        Knowledge of relational and non-relational databases;
        Strong experience in designing web application architecture and identifying technologies to solve problems;
        Excellent communication skills with the ability to explain and break down technical problems;
        Knowledge of test-driven development;
        Knowledge of sockets and queues; and
        Someone who likes to be challenged loves learning new things, and loves solving problems in a clean and modular way.`,
        location: "Ontario, Canada (Hybrid)",
        logo: "https://media.licdn.com/dms/image/C4E0BAQGZZi9C5UARaw/company-logo_100_100/0/1616615051263?e=1686787200&v=beta&t=SS6uPjJe3H5V29YI6j2sv_vL2dsW9CxpqnciiSIHM4I",
        platform: "LinkedIn",
      },
    ],
    skipDuplicates: true,
  });

  const allJobs = await prisma.job.findMany();
  console.dir(allJobs, { depth: null });
}

async function categories() {
  // await prisma.category.deleteMany({});
  await prisma.category.createMany({
    data: [
      { name: "Bookmarked" },
      { name: "Applied" },
      { name: "Interviewing" },
      { name: "Interviewed" },
      { name: "Job Offer" },
      { name: "Position Filled" },
    ],
  });
}

async function checklists() {
  // await prisma.checklist.deleteMany({});
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

async function users() {
  // await prisma.user.deleteMany({});
  await prisma.user.createMany({
    data: [
      {
        givenName: "Esther",
        familyName: "Choi",
        name: "Esther Choi",
        email: "esther@email.com",
      },
      {
        givenName: "Viet",
        familyName: "Tran",
        name: "Viet Tran",
        email: "viet@email.com",
      },
    ],
  });
}

// async function usersOnChecklists() {
//   // await prisma.usersOnChecklists.deleteMany({});
//   await prisma.usersOnChecklists.create({
//     data: { user: { connect: { id: 1 } }, checklist: { connect: { id: 1 } } },
//   });
// }

async function usersOnJobs() {
  // await prisma.usersOnChecklists.deleteMany({});
  await prisma.usersOnJobs.create({
    data: {
      user: { connect: { id: 1 } },
      job: { connect: { id: 1 } },
      category: { connect: { id: 1 } },
    },
  });
}

jobs()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

categories()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

checklists()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

users()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

// usersOnChecklists()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
