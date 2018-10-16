const express = require('express');
const bodyParser = require('body-parser');
const uniqid = require('uniqid');

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
    if (event.auid != '-1') {
        res.status(201);
    } else {
        auidGenerate = uniqid.time();
        res.status(201).json({
            message: 'worlding_analytics_user_id',
            auid: auidGenerate
        });        
    }
  });

app.get('/', (req, res, next) => {
  res.send('Hello to Worlding API!');
});

module.exports = app;