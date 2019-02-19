const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config');
const logger = require('./lib/logger');
const i = require("./i18n/localize");
const users = require('./routes/api/users');
const files = require('./routes/api/files');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Connect to mongodb
mongoose
    .connect(config.mongoURI)
    .then(() => logger.info(i('DB_CONNECTED')))
    .catch(err => logger.error(err));

// Passport middleware
app.use(passport.initialize());
require('./PassportStrategyConfig')(passport);  // configure passport

// ROUTES
app.use('/api/users', users);
app.use('/api/files', files);

const port = config.server.port || process.env.PORT || 5000;
let startupMessage = i("SERVER_UP", {port});
app.listen(port, () => logger.info(startupMessage));