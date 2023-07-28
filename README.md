# ProfAuth-Microservice
Backend repository for the Profile et Authentication Microservice

NestJS is a framework for building efficient, scalable Node.js server-side applications. It uses progressive JavaScript, is built with and fully supports TypeScript (yet still enables developers to code in pure JavaScript) and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).

Under the hood, Nest makes use of robust HTTP Server frameworks like ExpressJS (the default) and optionally can be configured to use Fastify as well!

To get started using the microservice:
1. Install NestJS CLI globally:  `yarn add --global @nestjs/cli`
2. Open one terminal, and `cd` into the `api-gateway/`
3. Run `yarn install` to install all dependencies
4. Open up another terminal and do the same for the user microservice
5. Run `cp .env.example .env` and set the values for the MySQL username and password
6. Start both servers with `yarn start:dev`
7. To run unit-tests, `yarn test` or `yarn test:e2e` for E2E tests
