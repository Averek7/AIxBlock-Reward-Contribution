const {inject, errorHandler} = require('express-custom-error');
inject(); // Patch express in order to use async / await syntax

// Require Dependencies

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const contributionRoutes = require('./routes/contributionRoutes');
const rewardRoutes = require('./routes/rewardRoutes');

require('dotenv').config();

const logger = require('./util/logger');

const { PORT } = process.env;

// Instantiate an Express Application
const app = express();

// Configure Express App Instance
app.use(express.json( { limit: '50mb' } ));
app.use(express.urlencoded( { extended: true, limit: '10mb' } ));

// Configure custom logger middleware
app.use(logger.dev, logger.combined);

app.use(cookieParser());
app.use(cors());
app.use(helmet());

// This middleware adds the json header to every response
app.use('*', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
})

// Assign Routes
app.use("/api/contributions", contributionRoutes);
app.use("/api/rewards", rewardRoutes);

// Handle errors
app.use(errorHandler());

app.get("/", (req, res) => res.send("AIxBlock Backend Running 🚀"));

// Open Server on selected Port
app.listen(
    PORT,
    () => console.info('Server listening on port ', PORT)
);