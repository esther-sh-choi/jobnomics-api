const { auth } = require("express-oauth2-jwt-bearer");
import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../type/job";
const { default: axios } = require("axios");

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

  const response = await axios.get(`${process.env.AUTH0_ISSUER}/userinfo`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  req.user = {
    given_name: response.data?.given_name,
    family_name: response.data?.family_name,
    nickname: response.data?.nickname,
    name: response.data?.name,
    picture: response.data?.picture,
    email: response.data?.email,
  };
  next();
};

module.exports = {
  validateAccessToken,
  getUserInfo,
};
