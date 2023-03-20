const { Configuration, OpenAIApi } = require("openai");
const puppeteer = require("puppeteer");

type jobDataType = {
  title: string;
  company: string;
  location: string;
  description: string;
  logo?: string;
  platformJobId: string | undefined;
  platform: string;
  summary: string;
  skills: [];
};

const requestToOpenAI = async (description: string, from: string) => {
  let contextDescription: string;
  if (from === "jobLink") {
    contextDescription = `Object with 2 keys summary and skills - Summary (string) in less than 150 words and tech skills (JS array of max 10 items, lowercase, order by importance) - Format in JSON: ${description}`;
  } else {
    contextDescription = `Give me 4 interview question and answer pairs (with answer less than 100 words) respectively to prepare for the following job description: ${description}`;
  }

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: contextDescription,
      },
    ],
    temperature: 0.7,
  });

  return completion.data.choices[0].message.content;
};

const getPlatformJobIdFromURL = (link: string, label: string) => {
  const urlId = link
    .split("&")
    .find((str: string | string[]) => str.includes(label));

  return urlId?.slice(urlId.indexOf("=") + 1);
};

const getPlatformJobIdDetailView = (link: string) => {
  const urlSplit = link.split("/");
  const indexOfId = urlSplit.indexOf("view") + 1;

  return urlSplit[indexOfId];
};

const extractLinkedIn = async (link: string, label: string = "") => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let platformJobId;
  if (label) {
    platformJobId = getPlatformJobIdFromURL(link, label);
  } else {
    platformJobId = getPlatformJobIdDetailView(link);
  }

  // user may paste in something like: https://www.linkedin.com/jobs/search/?currentJobId=3491773649&distance=25&geoId=101174742&keywords=js%20developer
  // extract the currentJobId if there is any = 3491773649

  await page.goto(`https://www.linkedin.com/jobs/view/${platformJobId}/`, {
    waitUntil: "networkidle0",
  });

  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });

  const title = await page.$x(
    "/html/body/main/section[1]/div/section[2]/div/div[1]/div/h1"
  );
  const company = await page.$x(
    "/html/body/main/section[1]/div/section[2]/div/div[1]/div/h4/div[1]/span[1]/a"
  );
  const location = await page.$x(
    "/html/body/main/section[1]/div/section[2]/div/div[1]/div/h4/div[1]/span[2]"
  );
  const description = await page.$x(
    "/html/body/main/section[1]/div/div/section[1]/div"
  );

  const logo = await page.$$eval(
    "img.artdeco-entity-image.artdeco-entity-image--square-5.lazy-loaded[src]",
    (imgs: { getAttribute: (arg0: string) => any; }[]) =>
      imgs[0].getAttribute("src")
  );

  let jobData: jobDataType = {
    logo,
    platformJobId,
    platform: "linkedin",
    title: "",
    company: "",
    location: "",
    description: "",
    summary: "",
    skills: [],
  };
  jobData.title = await page.evaluate(
    (el: { innerText: any; }) => el.innerText,
    title[0]
  );
  jobData.company = await page.evaluate(
    (el: { innerText: any; }) => el.innerText,
    company[0]
  );
  jobData.location = await page.evaluate(
    (el: { innerText: any; }) => el.innerText,
    location[0]
  );
  jobData.description = await page.evaluate(
    (el: { innerText: any; }) => el.innerText,
    description[0]
  );
  // jobData.description = jobData.description.replace(/(\r\n|\n|\r)/gm, "");

  const openaiData = await requestToOpenAI(jobData.description, "jobLink");
  const { summary, skills } = JSON.parse(openaiData);
  jobData = { ...jobData, summary, skills };
  // console.log(jobData);
  return jobData;
};

const extractIndeed = async (link: string, label: string = "") => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36"
  );
  const platformJobId = getPlatformJobIdFromURL(link, label);

  await page.goto(link, {
    waitUntil: "networkidle0",
  });

  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });

  let jobData: jobDataType = {
    platformJobId,
    platform: "indeed",
    title: "",
    company: "",
    location: "",
    description: "",
    summary: "",
    skills: [],
  };
  jobData.title = await page.$eval(
    ".jobsearch-JobInfoHeader-title-container",
    (el: { innerText: string; }) => el.innerText
  );
  jobData.company = await page.$eval(
    "div[data-company-name='true'] > a",
    (el: { innerText: string; }) => el.innerText
  );
  jobData.location = await page.$eval(
    "div.jobsearch-CompanyInfoWithoutHeaderImage > div > div > div:nth-child(2) > div",
    (el: { innerText: string; }) => el.innerText
  );
  jobData.description = await page.$eval(
    ".jobsearch-JobComponent-embeddedBody",
    (el: { innerText: string; }) => el.innerText
  );

  const companyPage = await page.$eval(
    "div[data-company-name='true'] > a",
    (el: { getAttribute: (arg0: string) => any; }) => el.getAttribute("href")
  );

  await page.goto(companyPage, {
    waitUntil: "networkidle0",
  });

  jobData.logo = await page.$$eval(
    "img[itemprop='image']",
    (imgs: { getAttribute: (arg0: string) => HTMLImageElement; }[]) =>
      imgs[0].getAttribute("src")
  );

  const openaiData = await requestToOpenAI(jobData.description, "jobLink");
  const { summary, skills } = JSON.parse(openaiData);
  jobData = { ...jobData, summary, skills };

  return jobData;
};

const extractZip = async (link: string, label: string = "") => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36"
  );

  const platformJobId = getPlatformJobIdFromURL(link, label);

  await page.goto(link, {
    waitUntil: "networkidle0",
  });

  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });

  let jobData: jobDataType = {
    logo: "N/A",
    platformJobId,
    platform: "zip-recruiter",
    title: "",
    company: "",
    location: "",
    description: "",
    summary: "",
    skills: [],
  };
  jobData.title = await page.$eval(
    "h1.job_title",
    (el: { innerText: string; }) => el.innerText
  );
  jobData.company = await page.$eval(
    ".hiring_company_text.t_company_name",
    (el: { innerText: string; }) => el.innerText
  );
  jobData.location = await page.$eval(
    "span[data-name='address']",
    (el: { innerText: string; }) => el.innerText
  );
  jobData.description = await page.$eval(
    ".jobDescriptionSection",
    (el: { innerText: string; }) => el.innerText
  );

  let companyPage = await page.$eval(
    ".hiring_company_text.t_company_name",
    (el: { getAttribute: (arg0: string) => any; }) => el.getAttribute("href")
  );

  if (companyPage) {
    await page.goto(`https://www.ziprecruiter.com${companyPage}`, {
      waitUntil: "networkidle0",
    });
    await page.waitForXPath(
      "/html/body/div[3]/main/div/section/article/div/div[2]/div/img",
      { timeout: 60000 }
    );

    jobData.logo = await page.$$eval(
      "div.company_image > img",
      (imgs: { getAttribute: (arg0: string) => HTMLImageElement; }[]) =>
        imgs[0].getAttribute("src")
    );
  }

  const openaiData = await requestToOpenAI(jobData.description, "jobLink");
  const { summary, skills } = JSON.parse(openaiData);
  jobData = { ...jobData, summary, skills };

  return jobData;
};

const runPuppeteer = async (link: string) => {
  if (link.includes("linkedin")) {
    if (link.includes("currentJobId")) {
      return await extractLinkedIn(link, "currentJobId");
    }
    return await extractLinkedIn(link);
  } else if (link.includes("indeed")) {
    return await extractIndeed(link, "vjk");
  } else if (link.includes("ziprecruiter")) {
    return await extractZip(link, "lvk");
  }
};

module.exports = {
  requestToOpenAI,
  runPuppeteer,
  getPlatformJobIdFromURL,
  getPlatformJobIdDetailView,
};
