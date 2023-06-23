require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

app.use(express.json());

// valorant api routes
const valorantRouter = require('./routes/valorantapi');
app.use('/valorantapi', valorantRouter);

// user routes
const accountRouter = require('./routes/users');
app.use('/users', accountRouter);

// open server
app.listen(PROCESS.ENV.PORT, () => console.log('Server started'));
