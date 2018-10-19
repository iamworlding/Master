const express = require('express');
const bodyParser = require('body-parser');
const uniqid = require('uniqid');
const mongoose = require('mongoose');

const date = require('date-and-time');

const now = new Date();

mongoose.connect('mongodb://localhost:27017/master');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(' >> MongoDB Connected | ' + date.format(now, 'YYYY/MM/DD HH:mm:ss'));
});

const app = express();

const Event = require('./models/event');
const Report = require('./models/report');

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
            type: req.body.type,
            date: req.body.date,
            date_int: req.body.date_int,
            user: {
                ip: req.body.user.ip,
                device: req.body.user.device,
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
                    device_agent: req.body.user.agent.device,
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
            type: req.body.type,
            date: req.body.date,
            date_int: req.body.date_int,
            user: {
                ip: req.body.user.ip,
                device: req.body.user.device,
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
                    device_agent: req.body.user.agent.device,
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

app.get('/report/landing_visit_last_30_days', (req, res, next) => {
    Report.findOne({_id: 'landing_visit_last_30_days'}, function (error, reports) {
    if (error) {
        res.status(500).send('Error');
        next();
    }
    res.status(201).send(reports);
  });  
});
app.get('/report/landing_visit_last_6_months', (req, res, next) => {
    Report.findOne({_id: 'landing_visit_last_6_months'}, function (error, reports) {
    if (error) {
        res.status(500).send('Error');
        next();
    }
    res.status(201).send(reports);
  });  
});

app.get('/', (req, res, next) => {
  res.send('Hello to Worlding API!');
});

module.exports = app;