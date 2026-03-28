# Fullstack web development - Part 13: Relational Databases

## Progress

[############################] 28/28

## Blog app backend with a PostgreSQL DB

This repository answers to exercises present in the current iteration (28.3.2026) of Fullstack Web Development MOOC Part 13 - Relational Databases. It's an express app that handles the backend for a fictional social media app about blogs. Functionalities include:

- User creation
- Login and logout
- Session validation
- Banning users
- Adding and removing blog recommendations
- Adding and removing blogs to personal reading lists
- Marking blogs read
- Routes for displaying user added blogs
- Rest tests for manual testing via VScode rest client
- Automated testing (via course material)
- Etc.

## Installation

First, create an .env file in the project root with the following key-value pairs:

```
DATABASE_URL=
SECRET=
PORT=
```

Database url is used to connect to your postgresql database. Secret is the hash key for tokens (any string). Port is used if needed to use something else besides the default port 3001.

Then in the project root:

```shell
npm install
npm run dev # run the app in development mode
npm run test # run tests
```