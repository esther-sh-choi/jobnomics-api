const { Configuration, OpenAIApi } = require("openai");
const puppeteer = require("puppeteer");
const randomColor = require("randomcolor");
const { v4: uuidv4 } = require('uuid');

import type { JobDataType, FormDataType } from "../type/auto";

const requestToOpenAI = async (description: string, from: string) => {
  let contextDescription: string;
  if (from === "jobLink") {
    contextDescription = `Please generate a JSON data (important!) with a 'summary' key (<=150 and >=100 words) summarizing ${description} and a 'skills' key (array of <=10 and >0 lowercase tech skills) mentioned in it, sorted by importance.`;
  } else {
    contextDescription = `Provide 5 interview question and answer pairs (50 to 100 words per answer) with each pair separated by an empty line for ${description}. Employer asking candidate.`;
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

const getPlatformJobIdFromURLIndeed = (link: string, label: string) => {
  const urlId = link.split(label);

  const newUrlId = urlId[1].split("&");

  return newUrlId.length > 0 ? newUrlId[0] : "";
};

export const getPlatformJobIdDetailView = (link: string) => {
  const urlSplit = link.split("/");
  const indexOfId = urlSplit.indexOf("view") + 1;

  return urlSplit[indexOfId];
};

const extractLinkedIn = async (link: string, label: string = "") => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    ignoreDefaultArgs: ["--disable-extensions"],
  });
  try {
    const page = await browser.newPage();

    let platformJobId;
    if (label) {
      platformJobId = getPlatformJobIdFromURL(link, label);
    } else {
      platformJobId = getPlatformJobIdDetailView(link);
    }

    // user may paste in something like: https://www.linkedin.com/jobs/search/?currentJobId=3491773649&distance=25&geoId=101174742&keywords=js%20developer
    // extract the currentJobId if there is any = 3491773649

    const linkedinLink = `https://www.linkedin.com/jobs/view/${platformJobId}`;
    await page.goto(linkedinLink, {
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

    let jobData: JobDataType = {
      logo: "N/A",
      link: linkedinLink,
      platformJobId,
      platform: "linkedin",
      title: "",
      company: "",
      location: "",
      description: "",
      summary: "",
      skills: [],
      avatarColor: "",
    };

    jobData.logo = await page.$$eval(
      "img.artdeco-entity-image.artdeco-entity-image--square-5.lazy-loaded[src]",
      (imgs: { getAttribute: (arg0: string) => any; }[]) =>
        imgs[0].getAttribute("src")
    );
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
    jobData.avatarColor = randomColor({ luminosity: "dark" });

    const openaiData = await requestToOpenAI(jobData.description, "jobLink");
    const { summary, skills } = JSON.parse(openaiData);
    jobData = { ...jobData, summary, skills };

    return jobData;
  } catch (e) {
    console.log(e);
  } finally {
    await browser.close();
  }
};

const extractIndeed = async (link: string, label: string = "") => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    ignoreDefaultArgs: ["--disable-extensions"],
  });
  try {
    const page = await browser.newPage();
    page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36"
    );
    const platformJobId = getPlatformJobIdFromURLIndeed(link, label);
    let newLink: string = link;
    if (!link.includes("tk=")) {
      newLink = `https://ca.indeed.com/viewjob?jk=${platformJobId}&tk=1gsddgmpfj30q801&from=hp`;
    }

    await page.goto(newLink, {
      waitUntil: "networkidle0",
    });

    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    let jobData: JobDataType = {
      platformJobId,
      link: newLink,
      platform: "indeed",
      title: "",
      company: "",
      location: "",
      description: "",
      summary: "",
      skills: [],
      logo: "N/A",
      avatarColor: "",
    };

    await page.waitForTimeout(2000);
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
    jobData.avatarColor = randomColor({ luminosity: "dark" });

    // jobData.description = await page.$x(
    //   ".jobsearch-JobComponent-embeddedBody",
    //   (el: { innerText: string; }) => el.innerText
    // );

    const [getXpath] = await page.$x(
      '//div[contains(@class,"jobsearch-JobComponent-description")]'
    );
    jobData.description = await page.evaluate(
      (name: any) => name.innerText,
      getXpath
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
  } catch (e) {
    console.log(e);
  } finally {
    await browser.close();
  }
};

const extractZip = async (link: string, label: string = "") => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    ignoreDefaultArgs: ["--disable-extensions"],
  });
  try {
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

    let jobData: JobDataType = {
      logo: "N/A",
      link,
      platformJobId,
      platform: "zip-recruiter",
      title: "",
      company: "",
      location: "",
      description: "",
      summary: "",
      skills: [],
      avatarColor: "",
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
    jobData.avatarColor = randomColor({ luminosity: "dark" });

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
  } catch (e) {
    console.log(e);
  } finally {
    await browser.close();
  }

};

const runPuppeteer = async (link: string) => {
  if (link.includes("linkedin")) {
    if (link.includes("currentJobId")) {
      return await extractLinkedIn(link, "currentJobId");
    }
    return await extractLinkedIn(link);
  } else if (link.includes("indeed")) {
    return await extractIndeed(link, "jk=");
  } else if (link.includes("ziprecruiter")) {
    return await extractZip(link, "lvk");
  }
};

const compileManualData = async (data: FormDataType) => {
  const { link, platform, title, company, location, description } = data;
  const openaiData = await requestToOpenAI(description, "jobLink");
  const { summary, skills } = JSON.parse(openaiData);

  const jobData: JobDataType = {
    logo: "N/A",
    link,
    platformJobId: uuidv4(),
    platform: platform ? platform : "unknown",
    title,
    company,
    location,
    description,
    summary,
    skills,
    avatarColor: randomColor({ luminosity: "dark" }),
  };

  return jobData;
};

module.exports = {
  requestToOpenAI,
  runPuppeteer,
  getPlatformJobIdFromURL,
  getPlatformJobIdDetailView,
  compileManualData,
  getPlatformJobIdFromURLIndeed,
};
