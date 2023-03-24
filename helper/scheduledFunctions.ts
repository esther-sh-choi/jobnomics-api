const cron = require('cron');
const aws = require("aws-sdk");
// const CronJob = require('cron').CronJob;

const timezone = 'America/Toronto';

// TODO: DONT PUSH TO GITHUB YET
const SESConfig = {
  apiVersion: '2010-12-01',
  accessKeyId: process.env.AWS_SES_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SES_SECRET_KEY,
  region: "us-east-2"
};

const ses = new aws.SES(SESConfig);

const customizeHTML = `<h1>Hello</h1>`;

const sesTest = (emailTo: string, emailFrom: string, message: string, name: string) => {
  const params = {
    Destination: {
      ToAddresses: [emailTo]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: customizeHTML
        },
      },
      Subject: {
        Data: "Name: " + emailFrom
      }
    },
    Source: emailFrom
  };
  return ses.sendEmail(params).promise();
};

const initScheduledJobs = () => {
  const scheduledJobFunction = new cron.CronJob('0 3 * * * *', () => {
    // sesTest("a9tran4@gmail.com", "viettran101294@gmail.com", "Hello world", "Viet").then((val: any) => {
    //   console.log("got this back", val);
    // }).catch((err: any) => {
    // });

    // TODO: Change the unverified field to verified field

    // TODO: 3 days before Interview -> send 1 question -> lead them to our website
    // TODO: Right after interview -> write notes and check out the checklist

    console.log("hello 3 am");
  }, null, true, timezone);


  scheduledJobFunction.start();
};


module.exports = {
  initScheduledJobs
};
