import axios from "axios";
import { Response } from "express";
import { prisma } from "../server";
import { CustomRequest } from "../type/job";
const aws = require("aws-sdk");

// given_name: string;
// family_name: string;
// nickname: string;
// name: string;
// picture: string;
// email: string;

// TODO: REMOVE AFTER
const SESConfig = {
  apiVersion: '2010-12-01',
  accessKeyId: "AKIASA24L64RHSFVAVVG",
  secretAccessKey: "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",
  region: "us-east-2"
};

const ses = new aws.SES(SESConfig);

const logInAndSignIn = async (req: CustomRequest, res: Response) => {
  if (req.user?.id) {
    return res.json({ message: "User is already registered" });
  } else {
    const accessToken = req?.headers?.authorization?.split(" ")[1];

    try {
      const response = await axios.get(`${process.env.AUTH0_ISSUER}/userinfo`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      await prisma.user.create({
        data: {
          givenName: response.data?.given_name,
          familyName: response.data?.family_name,
          nickname: response.data?.nickname,
          name: response.data?.name,
          picture: response.data?.picture,
          email: response.data?.email
        }
      });

    } catch (e) {
      console.log(e);
    }

    return res.json({ message: "Register Successful" });
  }
};
const sendEmailVerification = async (req: CustomRequest, res: Response) => {

  const params = {
    // EmailAddress: req.user.email
    EmailAddress: "a9tran4@gmail.com"
  };

  const run = async () => {
    return ses.verifyEmailAddress(params, function(err: any, data: any) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data);           // successful response
      /*
      data = {
      }
      */
    });
  };
  await run();
  return res.json({ message: "Sent verification" });
};

module.exports = { logInAndSignIn, sendEmailVerification };
