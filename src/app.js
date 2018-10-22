const express = require('express');
const bodyParser = require('body-parser');
const uniqid = require('uniqid');
const mongoose = require('mongoose');
const exphbs  = require('express-handlebars');
const path = require('path');
const date = require('date-and-time');

const mail = require('./utils/emails/mail');

const now = new Date();

mongoose.connect('mongodb://localhost:27017/master');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(' >> MongoDB Connected | ' + date.format(now, 'YYYY/MM/DD HH:mm:ss'));
});

const app = express();

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
  }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));


const Event = require('./models/event');
const Report = require('./models/report');
const User = require('./models/user');
const Comunication = require('./models/comunication');
const Promotion = require('./models/promotion');

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

app.post('/api/user/join', (req, res, next) => {
    User.findOne({email: req.body.email}, function (error, user) {
        if (error) {
            res.status(500).send('Error');
            next();
        }
        if(user != null){
            res.status(201).send({message: 'This email is registered'});
        } else {
            const newuser = new User ({
                auid: req.body.auid,
                name: req.body.name,
                email: req.body.email,
                language: req.body.language,
                date: req.body.date,
                date_int: req.body.date_int
            });
            newuser.save().then(() => {
                const comunication = new Comunication ({
                    userid: newuser._id,
                    channel: 'landingPage',
                    type: 'join',
                    date: req.body.date,
                    date_int: req.body.date_int
                });
                comunication.save();
                mail.sendMail(newuser.language, 'join', newuser.name, newuser.email);
                res.status(201).send({message: 'Register completed'});
            });
            
        }
      });
});

app.get('/api/user/join/confirm/:email', (req, res, next) => {
    User.findOne({email: req.params.email}, function (error, user) {
        if (error) {
            res.status(500).send('Error');
            next();
        }
        if(user != null && !user.email_confirm){
            User.findByIdAndUpdate(user._id, { $set: { email_confirm: true }}, { new: false }, function (err, user) {
                if (err) return handleError(err);
                const comunicationEmail = new Comunication ({
                    userid: user._id,
                    channel: 'landingPage',
                    type: 'email_confirm',
                    date: req.body.date,
                    date_int: req.body.date_int
                });
                comunicationEmail.save();
                mail.sendMail(user.language, 'email_confirm', user.name, user.email);

                const comunicationCode = new Comunication ({
                    userid: user._id,
                    channel: 'landingPage',
                    type: 'code',
                    date: req.body.date,
                    date_int: req.body.date_int
                });
                comunicationCode.save();
                mail.sendMail(user.language, 'code', user.name, user.email);

                const promotion = new Promotion ({
                    userid: user._id,
                    type: 'code',
                    code: '123456',
                    date_expired: '2019-12-31 00:00',
                    date_expired_int: 20191231
                });
                promotion.save();

                res.render('home');
              });
        } else {
            res.render('home');
        }
    });
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

app.get('/report/:id', (req, res, next) => {
    Report.findOne({_id: req.params.id}, function (error, reports) {
    if (error) {
        res.status(500).send('Error');
        next();
    }
    res.status(201).send(reports);
  });  
});

app.get('/', (req, res, next) => {
    res.render('home');
});

module.exports = app;