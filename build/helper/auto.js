"use strict";
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
exports.getPlatformJobIdDetailView = exports.getPlatformJobIdFromURL = void 0;
const { Configuration, OpenAIApi } = require("openai");
const puppeteer = require("puppeteer");
const requestToOpenAI = (description, from) => __awaiter(void 0, void 0, void 0, function* () {
    let contextDescription;
    if (from === "jobLink") {
        contextDescription = `Object with 2 keys summary and skills - Summary (string) in less than 150 words and tech skills (JS array of max 10 items, lowercase, order by importance) - Format in JSON: ${description}`;
    }
    else {
        contextDescription = `Give me 4 interview question and answer pairs (with answer less than 100 words) respectively to prepare for the following job description: ${description}`;
    }
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const completion = yield openai.createChatCompletion({
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
});
const getPlatformJobIdFromURL = (link, label) => {
    const urlId = link
        .split("&")
        .find((str) => str.includes(label));
    return urlId === null || urlId === void 0 ? void 0 : urlId.slice(urlId.indexOf("=") + 1);
};
exports.getPlatformJobIdFromURL = getPlatformJobIdFromURL;
const getPlatformJobIdDetailView = (link) => {
    const urlSplit = link.split("/");
    const indexOfId = urlSplit.indexOf("view") + 1;
    return urlSplit[indexOfId];
};
exports.getPlatformJobIdDetailView = getPlatformJobIdDetailView;
const extractLinkedIn = (link, label = "") => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer.launch();
    const page = yield browser.newPage();
    let platformJobId;
    if (label) {
        platformJobId = (0, exports.getPlatformJobIdFromURL)(link, label);
    }
    else {
        platformJobId = (0, exports.getPlatformJobIdDetailView)(link);
    }
    // user may paste in something like: https://www.linkedin.com/jobs/search/?currentJobId=3491773649&distance=25&geoId=101174742&keywords=js%20developer
    // extract the currentJobId if there is any = 3491773649
    const linkedinLink = `https://www.linkedin.com/jobs/view/${platformJobId}`;
    yield page.goto(linkedinLink, {
        waitUntil: "networkidle0",
    });
    yield page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
    });
    const title = yield page.$x("/html/body/main/section[1]/div/section[2]/div/div[1]/div/h1");
    const company = yield page.$x("/html/body/main/section[1]/div/section[2]/div/div[1]/div/h4/div[1]/span[1]/a");
    const location = yield page.$x("/html/body/main/section[1]/div/section[2]/div/div[1]/div/h4/div[1]/span[2]");
    const description = yield page.$x("/html/body/main/section[1]/div/div/section[1]/div");
    const logo = yield page.$$eval("img.artdeco-entity-image.artdeco-entity-image--square-5.lazy-loaded[src]", (imgs) => imgs[0].getAttribute("src"));
    let jobData = {
        logo,
        link: linkedinLink,
        platformJobId,
        platform: "linkedin",
        title: "",
        company: "",
        location: "",
        description: "",
        summary: "",
        skills: [],
    };
    jobData.title = yield page.evaluate((el) => el.innerText, title[0]);
    jobData.company = yield page.evaluate((el) => el.innerText, company[0]);
    jobData.location = yield page.evaluate((el) => el.innerText, location[0]);
    jobData.description = yield page.evaluate((el) => el.innerText, description[0]);
    const openaiData = yield requestToOpenAI(jobData.description, "jobLink");
    const { summary, skills } = JSON.parse(openaiData);
    jobData = Object.assign(Object.assign({}, jobData), { summary, skills });
    console.log("*********JOB DATA: ", jobData);
    return jobData;
});
const extractIndeed = (link, label = "") => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer.launch();
    const page = yield browser.newPage();
    page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");
    const platformJobId = (0, exports.getPlatformJobIdFromURL)(link, label);
    yield page.goto(link, {
        waitUntil: "networkidle0",
    });
    yield page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
    });
    let jobData = {
        platformJobId,
        link,
        platform: "indeed",
        title: "",
        company: "",
        location: "",
        description: "",
        summary: "",
        skills: [],
    };
    jobData.title = yield page.$eval(".jobsearch-JobInfoHeader-title-container", (el) => el.innerText);
    jobData.company = yield page.$eval("div[data-company-name='true'] > a", (el) => el.innerText);
    jobData.location = yield page.$eval("div.jobsearch-CompanyInfoWithoutHeaderImage > div > div > div:nth-child(2) > div", (el) => el.innerText);
    jobData.description = yield page.$eval(".jobsearch-JobComponent-embeddedBody", (el) => el.innerText);
    const companyPage = yield page.$eval("div[data-company-name='true'] > a", (el) => el.getAttribute("href"));
    yield page.goto(companyPage, {
        waitUntil: "networkidle0",
    });
    jobData.logo = yield page.$$eval("img[itemprop='image']", (imgs) => imgs[0].getAttribute("src"));
    const openaiData = yield requestToOpenAI(jobData.description, "jobLink");
    const { summary, skills } = JSON.parse(openaiData);
    jobData = Object.assign(Object.assign({}, jobData), { summary, skills });
    return jobData;
});
const extractZip = (link, label = "") => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer.launch();
    const page = yield browser.newPage();
    page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");
    const platformJobId = (0, exports.getPlatformJobIdFromURL)(link, label);
    yield page.goto(link, {
        waitUntil: "networkidle0",
    });
    yield page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
    });
    let jobData = {
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
    };
    jobData.title = yield page.$eval("h1.job_title", (el) => el.innerText);
    jobData.company = yield page.$eval(".hiring_company_text.t_company_name", (el) => el.innerText);
    jobData.location = yield page.$eval("span[data-name='address']", (el) => el.innerText);
    jobData.description = yield page.$eval(".jobDescriptionSection", (el) => el.innerText);
    let companyPage = yield page.$eval(".hiring_company_text.t_company_name", (el) => el.getAttribute("href"));
    if (companyPage) {
        yield page.goto(`https://www.ziprecruiter.com${companyPage}`, {
            waitUntil: "networkidle0",
        });
        yield page.waitForXPath("/html/body/div[3]/main/div/section/article/div/div[2]/div/img", { timeout: 60000 });
        jobData.logo = yield page.$$eval("div.company_image > img", (imgs) => imgs[0].getAttribute("src"));
    }
    const openaiData = yield requestToOpenAI(jobData.description, "jobLink");
    const { summary, skills } = JSON.parse(openaiData);
    jobData = Object.assign(Object.assign({}, jobData), { summary, skills });
    return jobData;
});
const runPuppeteer = (link) => __awaiter(void 0, void 0, void 0, function* () {
    if (link.includes("linkedin")) {
        if (link.includes("currentJobId")) {
            return yield extractLinkedIn(link, "currentJobId");
        }
        return yield extractLinkedIn(link);
    }
    else if (link.includes("indeed")) {
        return yield extractIndeed(link, "vjk");
    }
    else if (link.includes("ziprecruiter")) {
        return yield extractZip(link, "lvk");
    }
});
const compileManualData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, platform, title, company, location, description } = data;
    const openaiData = yield requestToOpenAI(description, "jobLink");
    const { summary, skills } = JSON.parse(openaiData);
    const jobData = {
        logo: "N/A",
        link,
        platformJobId: "",
        platform: platform ? platform : "unknown",
        title,
        company,
        location,
        description,
        summary,
        skills,
    };
    return jobData;
});
module.exports = {
    requestToOpenAI,
    runPuppeteer,
    getPlatformJobIdFromURL: exports.getPlatformJobIdFromURL,
    getPlatformJobIdDetailView: exports.getPlatformJobIdDetailView,
    compileManualData,
};
