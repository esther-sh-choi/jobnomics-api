import { Request, Response } from "express";
const puppeteer = require("puppeteer");
const { requestToOpenAI } = require("../helper/auto");

type jobDataType = {
  title: string;
  company_name: string;
  location: string;
  description: string;
  logo: string;
  platformJobId: string | undefined;
  platform: string;
};

const getPlatformJobIdFromURL = (link: string, label: string) => {
  const urlId = link
    .split("&")
    .find((str: string | string[]) => str.includes("currentJobId"));

  return urlId?.slice(urlId.indexOf("=") + 1);
};

const getJobInfo = (req: Request, res: Response) => {
  console.log("HERE!!!!");
  const start = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const inputLink =
      "https://www.linkedin.com/jobs/search/?currentJobId=3523596546&distance=25&geoId=101174742&keywords=js%20developer&position=4&pageNum=0";

    const platformJobId = getPlatformJobIdFromURL(inputLink, "currentJobId");

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

    const jobData: jobDataType = {
      logo,
      platformJobId,
      platform: "linkedin",
      title: "",
      company_name: "",
      location: "",
      description: "",
    };
    jobData.title = await page.evaluate(
      (el: { innerText: any; }) => el.innerText,
      title[0]
    );
    jobData.company_name = await page.evaluate(
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
    jobData.description = jobData.description.replace(/(\r\n|\n|\r)/gm, "");

    console.log(jobData);
  };

  start();
  requestToOpenAI("What is your name?");
};

module.exports = { getJobInfo };
