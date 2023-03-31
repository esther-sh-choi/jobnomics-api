import { AWSError } from "aws-sdk";
import axios from "axios";
import { Response } from "express";
import { prisma } from "../server";
import {
  CustomRequest,
  GetIdentityVerificationType,
  VerifyEmailAddressType,
} from "../type/job";
const aws = require("aws-sdk");

const SESConfig = {
  apiVersion: "2010-12-01",
  accessKeyId: process.env.AWS_SES_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SES_SECRET_KEY,
  region: "us-east-2",
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
          email: response.data?.email,
        },
      });
    } catch (e) {
      console.log(e);
    }

    return res.json({ message: "Register Successful" });
  }
};

const sendEmailVerification = async (req: CustomRequest, res: Response) => {
  const emailVerificationParams = {
    EmailAddress: req.user.email,
  };

  const getIdentityParams = {
    Identities: [req.user.email],
  };

  const run = async () => {
    return ses.getIdentityVerificationAttributes(
      getIdentityParams,
      function (err: AWSError, identityInfo: GetIdentityVerificationType) {
        if (err) {
          console.log(err, err.stack);
        } else {
          if (
            identityInfo?.VerificationAttributes[req.user.email || ""]
              ?.VerificationStatus !== "Success"
          ) {
            ses.verifyEmailAddress(
              emailVerificationParams,
              function (err: AWSError, data: VerifyEmailAddressType) {
                if (err) console.log(err, err.stack);
              }
            );
          }
        }
      }
    );
  };
  await run();

  return res.json({ message: "Sent verification" });
};

const sendSubscribeStatus = async (req: CustomRequest, res: Response) => {
  try {
    const userInfo = await prisma.user.findUniqueOrThrow({
      where: {
        id: req.user.id,
      },
      select: {
        nickname: true,
        emailVerified: true,
      },
    });

    return res.json({ userInfo });
  } catch (e) {
    return res.json({ error: "Cannot get user info." });
  }
};

const unsubscribe = async (req: CustomRequest, res: Response) => {
  const getIdentityParams = {
    Identity: req.user.email,
  };

  try {
    await ses.deleteIdentity(
      getIdentityParams,
      function (err: AWSError, identityInfo: GetIdentityVerificationType) {
        if (err) {
          console.log(err, err.stack);
        } else {
          console.log(identityInfo);
        }
      }
    );

    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        emailVerified: false,
      },
    });
  } catch (e) {
    console.log(e);
    return res.json({ message: "Failed to unsubscribe!" });
  }

  return res.json({ message: "Unsubscribe successfully!" });
};

module.exports = {
  logInAndSignIn,
  sendEmailVerification,
  sendSubscribeStatus,
  unsubscribe,
};
