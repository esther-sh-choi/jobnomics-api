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
const { auth } = require("express-oauth2-jwt-bearer");
const jwt = require('jsonwebtoken');
const SECRET = process.env.AUTH0_SECRET || '';
const { getUserIdByEmail, } = require("./job");
const validateAccessToken = auth({
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
    audience: process.env.AUTH0_AUDIENCE,
});
const getUserInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const accessToken = (_b = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
    const decoded = jwt.decode(accessToken);
    try {
        const email = decoded[SECRET];
        const user = yield getUserIdByEmail(email);
        req.user = {
            id: user === null || user === void 0 ? void 0 : user.id,
            email: email,
        };
    }
    catch (e) {
        return res.json({ error: "Error in getting user info" });
    }
    next();
});
module.exports = {
    validateAccessToken,
    getUserInfo,
};
