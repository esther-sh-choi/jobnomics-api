"use strict";
//  npx prisma migrate reset
// npx ts-node prisma/seed.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.skill.createMany({
            data: [
                {
                    name: "javascript",
                },
                {
                    name: "react",
                },
            ],
        });
        const skillsArray = yield prisma.skill.findMany();
        // console.log(
        //   skillsArray.map((skill) => {
        //     return { skill: { connect: { id: skill.id } } };
        //   })
        // );
        yield prisma.job.create({
            data: {
                link: "https://www.linkedin.com/jobs/view/3523183464",
                logo: "https://media.licdn.com/dms/image/C560BAQG-22OtXJPGpA/company-logo_100_100/0/1568751879393?e=1687392000&v=beta&t=j_QCmil4exCY-iti1r6E-PaqBxQgdEd_sG8aVghsv6o",
                title: "Software Engineer, Frontend - Slack (Software II, Senior, and Staff)",
                company: "Slack",
                description: `We're looking for people who are passionate about crafting phenomenal web applications.

      As a Frontend Engineer you’ll use your extensive knowledge of JavaScript, HTML, and CSS to improve the Slack web client, a complex in-browser application relied upon by millions of users every day. You will work with real-time data streams, engineer for performance across browsers, and delight people by making the best software we can imagine. You will collaborate closely with Product, Design, Application Engineering, and QA to spec, conceptualize, build, test and deploy new features for our large (and growing!) user base.
      
      We’re currently hiring different levels of Frontend Engineers across pillars such as Conversations Search & Channels, Canvas, Quip, Virtual HQ, Developer Experience, Line of Business, Network, Expansion, and Platform.
      
      What You Will Be Doing
      
      You'll brainstorm with Product Managers and Designers to conceptualize new features.
      You'll collaborate with Application Engineering to build new features for our large-and-growing user base.
      You'll learn about new web technologies and discuss potential solutions to problems.
      You'll help our skilled support team triage bugs and tackle production issues.
      You'll mentor other engineers and deeply review code.
      
      What You Should Have
      
      3-15+ years of experience writing client-side JavaScript and React Framework.
      Expertise in building complex layouts with CSS and HTML.
      Experience building and debugging complex systems in a team environment.
      Experience with modern browser technologies.
      Strong UX and design sensibilities, and a desire to sweat the small stuff.
      Strong communication skills, a positive attitude, and empathy.
      Self-awareness and a desire to continually improve.
      You have a bachelor's degree in Computer Science, Engineering or related field, or equivalent training, fellowship, or work experience.
      `,
                location: "Toronto, ON",
                platform: "LinkedIn",
                skills: {
                    connect: [{ id: 1 }],
                },
            },
            include: {
                skills: true,
            },
        });
        yield prisma.job.create({
            data: {
                link: "https://www.linkedin.com/jobs/view/3482562469",
                title: "Gameplay Engineer",
                company: "Next Level Games",
                description: `About the job
      STUDIO
      
      Next Level Games is a wholly owned subsidiary of Nintendo Co., Ltd.
      
      
      We’ve been passionate about video game development for 20 years now, shipping award-winning games for fans across the world and still going strong. Some of our titles include Super Mario Strikers, Mario Strikers Charged, Punch-Out!!, Luigi’s Mansion: Dark Moon, Metroid Prime Federation Force, Luigi’s Mansion 3 and most recently Mario Strikers™: Battle League.
      
      
      At NLG, we believe that a project finds success when we all work together in harmony. Therefore, we place careful consideration on building and nurturing an environment where everyone feels welcome and has fun in the process of achieving our shared goals.
      
      
      GAMEPLAY ENGINEER
      
      We are looking for an experienced Gameplay Engineer join our team of seasoned, passionate and talented game developers at Next Level Games.
      
      
      RESPONSIBILITIES
      
      The Gameplay Engineer will work closely with Game Director, Tech Director, Designers, Gameplay Team and/or Gameplay Animators to implement core gameplay mechanics.
      
      KEY QUALIFICATIONs
      
      Post-secondary degree in Computer Science or similar, or equivalent experience
      Strong C++ skills
      Strong linear algebra skills
      Good grasp of game design fundamentals
      Excellent analytical and problem-solving skills
      Works well within team environment
      Highly organized and self-motivated
      NICE TO HAVE
      
      Experience with game AI fundamentals
      Experience with skeletal animation systems
      Experience with console hardware
      Experience with real-time physics systems
      
      We wish to thank all applicants in advance; however, only those under consideration will be contacted. We are currently only considering applicants who already have work eligibility in Canada.
  `,
                location: "Vancouver, BC (Hybrid)",
                platform: "LinkedIn",
                skills: {
                    connect: [{ id: 1 }, { id: 2 }],
                },
            },
            include: {
                skills: true,
            },
        });
        yield prisma.job.create({
            data: {
                link: "https://ca.indeed.com/jobs?q=Senior+Full+Stack+Software+Engineer&l=Markham%2C+ON&from=searchOnHP&vjk=0a688db5bc462049",
                title: "Senior Full Stack Software Engineer",
                company: "Bellwood Labs",
                description: `About the job
      Bellwood Labs is a dynamic Product Development Consultancy founded in Atlanta and funded by Mark Cuban that has navigated to profitability and is hiring for growth.
      
      We are seeking a Senior Full Stack Software Engineer to build and scale a variety of Web and Mobile Products for an intriguing range of clients.
      
      This is a unique opportunity to work alongside an experienced team that excels at building SaaS products. This position reports to a Development Team Lead. Because this is a remote position, we will consider applicants based in the US and Canada.
      
      Key Responsibilities include:
      
      Design, build, scale, and enhance Software Products, Apps, and Platforms based on Client Needs and Business Requirements
      Communicate Technical Topics clearly, in language that can be easily understood by Clients
      Collaborate with Designers, and Product Teams to propose solutions to meet the goals of Clients and their Products
      Define, refine, and document Best Practices that enable excellent team performance
      Qualifications
      Experience developing applications in Ruby on Rails, React, React Native, Node, or Java is necessary, though the role also requires a voracious appetite to learn and apply new skills. You should be skilled at building web-based software or mobile apps and excel at learning new languages and frameworks.
      
      We’re looking for someone who:
      
      Has a minimum of 5+ years full-stack software development experience in a professional work environment
      Offers additional full-stack software development experience in other environments - school, GitHub, etc.
      Has experience building and scaling Software Products
      Has worked in a dynamic, small company environment and has a demonstrated ability to deliver with minimal direction
      Has experience architecting and deploying Software Products to Cloud Providers like Google Cloud, Amazon Web Services, or Azure
      Can communicate complex subject matter with clarity in both written and spoken form
      Has a passion for technology that has impacted your education and career choices
      Preferably has several years of experience with some combination of NodeJS, Ruby on Rails, React, React Native, and Angular
      Benefits
      
      Remote
      Unlimited PTO
      Subsidized Medical, Dental, and Vision Insurance
      Short/Long Term Disability
      Profit Sharing
      Referral Bonuses
      Company Retreats
      Our Mission
      Bellwood Labs seeks to be and be known as the most trusted partner to develop and advance software products.
      
      Our Core Values
      
      We Embrace Your Goals
      We Own our Commitments
      We Succeed through Empathy
      We Take the Next Step
      Join our tight-knit team of sharp technologists to leverage your talents and grow your skills. We are looking forward to meeting with you!
      
      Job Type: Full-time
      
      Pay: $95,000.00-$120,000.00 per year
      
      Benefits:
      
      Company events
      Dental care
      Disability insurance
      Paid time off
      Profit sharing
      Vision care
      Work from home
      Schedule:
      
      Monday to Friday      
  `,
                location: "Toronto, ON (Remote)",
                platform: "Indeed",
                skills: {
                    connect: [{ id: 1 }, { id: 2 }],
                },
            },
            include: {
                skills: true,
            },
        });
        const allJobs = yield prisma.job.findMany({
            include: {
                skills: true,
            },
        });
        console.dir(allJobs, { depth: null });
        yield prisma.category.createMany({
            data: [
                { name: "Bookmarked" },
                { name: "Applied" },
                { name: "Interviewing" },
                { name: "Interviewed" },
                { name: "Job Offer" },
                { name: "Position Filled" },
            ],
        });
        yield prisma.checklist.createMany({
            data: [
                { description: "Celebrate your accomplishments" },
                {
                    description: "Record your interview experience, questions, and your response",
                },
                {
                    description: "Send a thank you note to the hiring manager/interviewers",
                },
                {
                    description: "Remind your references to expect a call or email from the employer",
                },
                { description: "Update your interview prep notes" },
            ],
        });
        yield prisma.user.create({
            data: {
                givenName: "Esther",
                familyName: "Choi",
                name: "Esther Choi",
                email: "esther@email.com",
            },
            include: {
                checklists: true,
            },
        });
        yield prisma.user.create({
            data: {
                givenName: "Viet",
                familyName: "Tran",
                name: "Viet Tran",
                email: "viet@email.com",
            },
            include: {
                checklists: true,
            },
        });
        const checklistArray = yield prisma.checklist.findMany();
        yield prisma.usersOnChecklists.createMany({
            data: checklistArray.map((checklist) => ({
                userId: 1,
                jobId: 1,
                checklistId: checklist.id,
                isComplete: false,
            })),
        });
        const allUsers = yield prisma.user.findMany({
            include: {
                checklists: true,
            },
        });
        console.dir(allUsers, { depth: null });
        yield prisma.usersOnJobs.create({
            data: {
                user: { connect: { id: 1 } },
                job: { connect: { id: 1 } },
                position: 0,
                interviewDate: null,
                category: { connect: { id: 1 } },
            },
        });
        yield prisma.usersOnJobs.create({
            data: {
                user: { connect: { id: 1 } },
                job: { connect: { id: 2 } },
                position: 1,
                interviewDate: null,
                category: { connect: { id: 1 } },
            },
        });
        yield prisma.usersOnJobs.create({
            data: {
                user: { connect: { id: 1 } },
                job: { connect: { id: 3 } },
                position: 0,
                interviewDate: null,
                category: { connect: { id: 2 } },
            },
        });
        yield prisma.usersOnJobs.create({
            data: {
                user: { connect: { id: 2 } },
                job: { connect: { id: 1 } },
                position: 0,
                interviewDate: null,
                category: { connect: { id: 1 } },
            },
        });
    });
}
seed()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
// {
//   title: "Front-End Developer",
//   company: "Priceline",
//   description: `Why This Job’s a Big Deal
//   As a Software Engineer/Developer, you will collaborate with a small, tight knit team of cutting edge, coding thought leaders who set the strategy for our customer interface in an engaging and ethical way. You will also be working closely with the product and design teams of Priceline. Self-starters are encouraged to explore, fail fast, and build new things, and will be given opportunities to be developed and grow within the company.
//   In This Role You Will Get To
//   Contribute to projects with direct impact on the evolution of Priceline's business.
//   Be part of a cross-functional team that experiments, iterates and delivers on product objectives.
//   Showcase your expertise in building an engaging user experience.
//   Design and develop systems supporting our Hotel, Airline, Rental Car and Vacation Package businesses, that serve hundreds of millions of searches a day.
//   Build relationships and interact with Product and Design team members on a modern technology stack grounded in Node.js, with Javascript frameworks and patterns like Redux.
//   Optimize our sites for cross-device performance, including mobile, desktop, and tablets.
//   Who You Are
//   Bachelor’s degree or higher in Computer Science or equivalent.
//   5+ years of JavaScript along with experience working on, consumer facing projects.
//   Expertise in one or more modern client side JavaScript framework or library (React, Angular, Ember).
//   Experienced building applications with Node.js, has an understanding about how Node works and applying common libraries like Express.
//   Ability to develop and consume GraphQL APIs.
//   Comfort and experience with functional programming.
//   Ability to author semantic and accessible markup and style.
//   Experience with Styled Components or similar CSS in Javascript framework is a plus.
//   Established software development best practices, including writing unit tests and collaborating over programming in peer code review.
//   Illustrated history of living the values necessary to Priceline: Customer, Innovation, Team, Accountability and Trust.
//   The Right Results, the Right Way is not just a motto at Priceline; it’s a way of life. Unquestionable integrity and ethics is essential.`,
//   location: "Toronto, ON (Hybrid)",
//   platform: "LinkedIn",
// },
// {
//   title: "Technical Lead Frontend Engineer",
//   company: "Arteria AI",
//   description: `About Arteria AI
//   Arteria AI comprises a passionate, rapidly growing team of engineers, designers, data scientists, and lawyers with a vision to build transformative, AI-enabled solutions for the business world. Our mission is to help companies transform how they interact with their most important documents, their contracts.
//   With our award-winning technology in intelligent contracting, we are looking for enthusiastic individuals who want to grow and win with us!
//   The Position
//   This is an excellent role for anybody interested in making an impact and joining a friendly team driven by innovation and growth.
//   As a Technical Lead at Arteria AI, you will play an active role in expanding our enterprise SaaS platform for digital contracting.
//   Our ideal candidate is passionate about software development, design, and the usability of what is being built.
//   Additionally, we are looking for a candidate with a solid analytical mindset who takes ownership over their work, including developing new features, enhancing existing features, and ensuring their code is thoroughly tested and working correctly. You would also work closely with our product team to create proofs-of-concept and prototypes for potential new features.
//   A Week in Your New Life:
//   You want to spend at least 60% of your time coding being hands on the keyboard also love being creative through tech design and architecture;
//   You are a key figure in helping drive and shape our application into the future. Your opinion is valued and sought after;
//   You spend time mentoring our awesome Junior developers, nurturing their growth, and helping them succeed;
//   You have Developers lean on your designs to help them grow and build stronger features;
//   You build awesome reusable code and share those great ideas with your colleagues (they are pumped, by the way!);
//   You are a guiding force in helping to unblock the team in delivering its goals;
//   You care deeply about testing and how that impacts the team
//   You review some great code and provide feedback that improves the team;
//   You are a pillar in the construction and design of our architecture; and
//   You are engaged and find great purpose in helping the Arteria Team reach new heights.
//   What You Bring:
//   We are hiring engineering leads with the following experience:
//   B.S. or M.S. degree in Computer Science or a related technical field;
//   8+ years of experience building software solutions in a corporate or start-up engineering environment
//   7+ years experience developing web applications;
//   5+ years using React and Redux along with JavaScript and TypeScript;
//   2+ years in a technical leadership role;
//   Experience with semantic HTML5 elements and modern CSS techniques;
//   A strong background in data structures, algorithms, and design patterns;
//   Knowledge of relational and non-relational databases;
//   Strong experience in designing web application architecture and identifying technologies to solve problems;
//   Excellent communication skills with the ability to explain and break down technical problems;
//   Knowledge of test-driven development;
//   Knowledge of sockets and queues; and
//   Someone who likes to be challenged loves learning new things, and loves solving problems in a clean and modular way.`,
//   location: "Ontario, Canada (Hybrid)",
//   logo: "https://media.licdn.com/dms/image/C4E0BAQGZZi9C5UARaw/company-logo_100_100/0/1616615051263?e=1686787200&v=beta&t=SS6uPjJe3H5V29YI6j2sv_vL2dsW9CxpqnciiSIHM4I",
//   platform: "LinkedIn",
// },
