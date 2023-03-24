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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const server_1 = require("../server");
const aws = require("aws-sdk");
const SESConfig = {
    apiVersion: '2010-12-01',
    accessKeyId: process.env.AWS_SES_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SES_SECRET_KEY,
    region: "us-east-2"
};
const ses = new aws.SES(SESConfig);
const logInAndSignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) {
        return res.json({ message: "User is already registered" });
    }
    else {
        const accessToken = (_c = (_b = req === null || req === void 0 ? void 0 : req.headers) === null || _b === void 0 ? void 0 : _b.authorization) === null || _c === void 0 ? void 0 : _c.split(" ")[1];
        try {
            const response = yield axios_1.default.get(`${process.env.AUTH0_ISSUER}/userinfo`, {
                headers: {
                    authorization: `Bearer ${accessToken}`,
                },
            });
            yield server_1.prisma.user.create({
                data: {
                    givenName: (_d = response.data) === null || _d === void 0 ? void 0 : _d.given_name,
                    familyName: (_e = response.data) === null || _e === void 0 ? void 0 : _e.family_name,
                    nickname: (_f = response.data) === null || _f === void 0 ? void 0 : _f.nickname,
                    name: (_g = response.data) === null || _g === void 0 ? void 0 : _g.name,
                    picture: (_h = response.data) === null || _h === void 0 ? void 0 : _h.picture,
                    email: (_j = response.data) === null || _j === void 0 ? void 0 : _j.email
                }
            });
        }
        catch (e) {
            console.log(e);
        }
        return res.json({ message: "Register Successful" });
    }
});
const sendEmailVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        // EmailAddress: req.user.email
        EmailAddress: "a9tran4@gmail.com"
    };
    const run = () => __awaiter(void 0, void 0, void 0, function* () {
        return ses.verifyEmailAddress(params, function (err, data) {
            if (err)
                console.log(err, err.stack); // an error occurred
            else
                console.log(data); // successful response
            /*
            data = {
            }
            */
        });
    });
    yield run();
    return res.json({ message: "Sent verification" });
});
module.exports = { logInAndSignIn, sendEmailVerification };
