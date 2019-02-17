const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config');
const users = require('./routes/api/users');
const files = require('./routes/api/files');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Connect to mongodb
mongoose
    .connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected.'))
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
require('./PassportStrategyConfig')(passport);  // configure passport

// ROUTES
app.use('/api/users', users);
app.use('/api/files', files);

const port = config.server.port || process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));