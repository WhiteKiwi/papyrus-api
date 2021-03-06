<h1 align="center">papyrus-api</h1>
<p align="center">The API Server for Papyrus services. </p>


# Tech Stack
#### Backend
- Node.js
- Express - Applied RC(Repository Controller) Pattern
#### DB
- MySQL
#### Error Tracking
- Sentry - https://sentry.io
#### Logger
- Morgan - https://github.com/expressjs/morgan
#### Test
- mocha
- chai
- shoud
- super
#### Lint
- eslint - [The applied lint rules](https://github.com/WhiteKiwi/papyrus-api/blob/master/.eslintrc.js)
#### CI/CD
- Github Actions
- Heroku


# API Documents
[Postman Docs](https://documenter.getpostman.com/view/10725630/T1LHG9bi)


# Run in local environment
#### 1. Clone repository
```
git clone https://github.com/whitekiwi/papyrus-api
```

#### 2. Install modules
```
npm install
```

#### 3. Set Environment Variables
```
Copy .env.sample and set environment variables 
```

#### 4. Run
```
npm start
```


