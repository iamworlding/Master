const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});

app.post('/api/event', (req, res, next) => {
    const event = req.body;
    console.log(event);
    res.status(201).json({
        message: 'Event saved!'
    })
  });

app.get('/', (req, res, next) => {
  res.send('Hello to Worlding API!');
});

module.exports = app;