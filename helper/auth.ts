const { auth } = require("express-oauth2-jwt-bearer");
import { Response, NextFunction } from "express";
import { CustomRequest } from "../type/job";
const jwt = require('jsonwebtoken');
const SECRET = process.env.AUTH0_SECRET || '';

const {
  getUserIdByEmail,
} = require("./job");

const validateAccessToken = auth({
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  audience: process.env.AUTH0_AUDIENCE,
});

const getUserInfo = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req?.headers?.authorization?.split(" ")[1];
  const decoded = jwt.decode(accessToken);

  try {
    const email = decoded[SECRET];
    //const user = await getUserIdByEmail(email);

    req.user = {
      id: 2,
      email: "viettran101294@gmail.com",
    };
  } catch (e) {
    console.log(e);
    return res.json({ error: "Error in getting user info" });
  }

  next();
};

module.exports = {
  validateAccessToken,
  getUserInfo,
};
