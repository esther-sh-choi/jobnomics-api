
<h1 align="center">
  <br>
  <a href="https://jobnomics.net/"><img src="https://user-images.githubusercontent.com/70352144/228985158-dbfd0ef1-3df7-4628-8161-5011e6db8cf0.png" alt="ReMe" width="400"></a>
  <br>
  <br>
  JOBNOMICS
  <br>
    <div align="center">
    <a href="https://github.com/esther-sh-choi/jobnomics-api/actions/workflows/emergency-deployment.yml"><img src="https://github.com/esther-sh-choi/jobnomics-api/actions/workflows/emergency-deployment.yml/badge.svg" alt="Emergency Deployment Badge" ></a>
  </div>  
</h1>


<h4 align="center">This backend application is written in Node.js (<a href="https://expressjs.com/">Express.js</a>) and deployed automatically to <a href="https://railway.app/">Railway.app</a> on merges to main. The frontend made in React.js can be accessed at <a href="https://github.com/tienviet10/jobnomics">Jobnomics Frontend.</a></h4>

<p align="center">
  <a href="#final-product">Final Product</a> •
  <a href="#dependencies">Dependencies</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#authors">Authors</a> 
</p>


## Final Product


## Dependencies

**Dependencies**

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Prisma/client](https://www.prisma.io/)
- [aws-sdk](https://aws.amazon.com/developer/language/javascript/)
- [axios](https://axios-http.com/)
- [cors](https://github.com/expressjs/cors)
- [cron](https://github.com/kelektiv/node-cron)
- [dotenv](https://github.com/motdotla/dotenv#readme)
- [morgan](https://github.com/expressjs/morgan#readme)
- [express-oauth2-jwt-bearer](https://github.com/auth0/node-oauth2-jwt-bearer/tree/main/packages/express-oauth2-jwt-bearer)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [openai](https://platform.openai.com/)
- [puppeteer](https://pptr.dev/)
- [randomcolor](https://randomcolor.lllllllllllllllll.com/)

**Dev-dependencies**
- [TypeScript](https://www.typescriptlang.org/)
- [Nodemon](https://nodemon.io/)
- [Prisma](https://www.prisma.io/)

## Database
The PostgreSQL schema ERD:


![Final Project drawio](https://user-images.githubusercontent.com/70352144/229010062-b4cb1ce9-8c5a-475c-852c-584373b2b3e0.png)


## Getting Started

**Prerequisites:**

* [Git](https://git-scm.com) 
* [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) 10.x or more
* [psql](https://www.postgresql.org/docs/current/app-psql.html)


**Server:**

1. Connect to your postgres server


2. Create a folder and clone this repository

```sh
git clone https://github.com/esther-sh-choi/jobnomics-api.git
```

3. Move to the correct directory

```sh
cd jobnomics-api
```

4. Install dependencies

```sh
npm install
```

5. Sign up with Auth0. Add localhost link to Allowed Callback URLs, Allowed Logout URLs, and Allowed Web Origins. Additionally, turn on Refresh Token Rotaion. Finally, create a rule to add email field in the token. + Create an API in Application and ensure to allow Allow Offline Access.

6. Sign up for Amazon SES

7. Create a .env file according to the template below

```sh
DATABASE_URL=
OPENAI_API_KEY=
AUTH0_DOMAIN=
AUTH0_AUDIENCE=
AUTH0_ISSUER=
AUTH0_SECRET=
AWS_SES_ACCESS_KEY=
AWS_SES_SECRET_KEY=
```

8. Initlize a migration

```sh
npx prisma migrate dev --name init
```

9. Run the development web server

```sh
npm start
```


## Deployment
- Deployed to <a href="https://railway.app/">Railway.app</a>
- Postgres Database hosted by <a href="https://railway.app/">Railway.app</a>.

## Authors
- <a href="https://github.com/tienviet10">Viet Tran</a>
- <a href="https://github.com/esther-sh-choi">Esther Choi</a>
