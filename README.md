# eFinance

A simple app for managing personal finance. Inspired by the way I learned how to handle my day to day income and outcome during my time in high school and university.

## Functionality

Allows creating virtual wallets in 3 currencies and keep track of the cash flow through each of them by keeping track of the operations history.

## Technologies

- React v17.0.2
- Sass
- Express.js v4.17.1
- Mongoose v6.0.5

## Setup

To run this project it is necessary to create a mongo database with 3 collections:

- operations
- users
- wallets

Once that is done copy file `example.nodemon.js`, rename it to `nodemon.js` and fill the fileds `mongoURI` with URI for the created database and `jwtSecret` with secret key for jsonwebtoken.

Using npm in root project folder run:

```
npm i
cd client
npm i
```

Once the dependencies are installed, in one console in root folder run:

```
npm run dev
```

In another console in client folder run:

```
npm start
```

## Live Demo

Alternatively use live demo app [here](https://e-finance.herokuapp.com)

Please note that the data submitted to the demo version is deleted on a regular basis.
