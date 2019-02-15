const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/api/users');
const files = require('./routes/api/files');

const app = express();

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to mongodb
mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected.'))
    .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World'));

// ROUTES
app.use('/api/users', users);
app.use('/api/files', files);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));