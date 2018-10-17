const express = require('express');
const bodyParser = require('body-parser');
const uniqid = require('uniqid');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/master');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected');
  
});

const app = express();

const Event = require('./models/event');

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
    eventData = req.body;    
    if (eventData.auid != '-1') {
        const event = new Event({
            auid: req.body.auid,
            origin: req.body.origin,
            data_date: req.body.date,
            user: {
                ip: req.body.user.ip,
                referer: req.body.user.referer,
                url: req.body.user.url,
                lat: req.body.user.lat,
                lon: req.body.user.lon,
                city: req.body.user.city,
                zip: req.body.user.zip,
                country: req.body.user.country,
                agent: {
                    userAgent: req.body.user.agent.userAgent,
                    os: req.body.user.agent.os,
                    browser: req.body.user.agent.browser,
                    device: req.body.user.agent.device,
                    os_version: req.body.user.agent.os_version,
                    browser_version: req.body.user.agent.browser_version,
                }
            }    
        });
        event.save();        
        res.status(201);
    } else {
        auidGenerate = uniqid.process();
        const event = new Event({
            auid: auidGenerate,
            origin: req.body.origin,
            data_date: req.body.date,
            user: {
                ip: req.body.user.ip,
                referer: req.body.user.referer,
                url: req.body.user.url,
                lat: req.body.user.lat,
                lon: req.body.user.lon,
                city: req.body.user.city,
                zip: req.body.user.zip,
                country: req.body.user.country,
                agent: {
                    userAgent: req.body.user.agent.userAgent,
                    os: req.body.user.agent.os,
                    browser: req.body.user.agent.browser,
                    device: req.body.user.agent.device,
                    os_version: req.body.user.agent.os_version,
                    browser_version: req.body.user.agent.browser_version,
                }
            }    
        });
        event.save();
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