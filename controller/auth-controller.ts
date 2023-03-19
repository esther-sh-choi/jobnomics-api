import axios from "axios";
import { Response } from "express";
import { prisma } from "../server";
import { CustomRequest } from "../type/job";

// given_name: string;
// family_name: string;
// nickname: string;
// name: string;
// picture: string;
// email: string;

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

module.exports = { logInAndSignIn };
