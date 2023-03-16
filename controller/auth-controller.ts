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
  const user = await prisma.user.findUnique({
    where: {
      email: req?.user?.email
    }
  });

  if (user) {
    return res.json({ message: "User is already registered" });
  } else {
    const newUser = await prisma.user.create({
      data: {
        givenName: req.user.given_name,
        familyName: req.user.family_name,
        nickname: req.user.nickname,
        name: req.user.name,
        picture: req.user.picture,
        email: req.user.email
      }
    });
    return res.json({ message: "Register Successful" });
  }
};

module.exports = { logInAndSignIn };
