const express = require('express');
const bodyParser = require('body-parser');
const uniqid = require('uniqid');
const mongoose = require('mongoose');
const exphbs  = require('express-handlebars');
const path = require('path');
const date = require('date-and-time');

const mail = require('./utils/emails/mail');
const start = new Date();

function getYear(now) {
    return String(now.getFullYear());
  };
 function getMonth(now) {
    return String(month[now.getMonth()]);
};
function getDay(now) {
    if ( String(now.getDate()).length === 1 ) {
      return String('0' + now.getDate());
    } else {
      return String(now.getDate());
    }
};
function getHours(now) {
    if ( String(now.getHours()).length === 1 ) {
      return String('0' + now.getHours());
    } else {
      return String(now.getHours());
    }
};
function getMinutes(now) {
    if ( String(now.getMinutes()).length === 1 ) {
      return String('0' + now.getMinutes());
    } else {
      return String(now.getMinutes());
    }
};


const month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

function dateString() {
    const now = new Date();
    const yearDate = getYear(now);
    const monthDate = getMonth(now);
    const dayDate = getDay(now);
    const hoursDate = getHours(now);
    const minutesDate = getMinutes(now);

    return yearDate + '/' + monthDate + '/' + dayDate + ' ' + hoursDate + ':' + minutesDate;
};

function dateInt() {
    const now = new Date();
    const yearDate = getYear(now);
    const monthDate = getMonth(now);
    const dayDate = getDay(now);
    const hoursDate = getHours(now);
    const minutesDate = getMinutes(now);

    return parseInt(yearDate + monthDate + dayDate, 10);
};



mongoose.connect('mongodb://localhost:27017/master');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(' >> MongoDB Connected | ' + date.format(start, 'YYYY/MM/DD HH:mm:ss'));
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
const Contact = require('./models/contact');
const Analytics = require('./models/analytics');

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
                name: req.body.name,
                email: req.body.email,
                language: req.body.language,
                date: req.body.date,
                date_int: req.body.date_int
            });
            newuser.save().then(() => {
                const comunication = new Comunication ({
                    auid: req.body.auid,
                    channel: 'landingPage',
                    type: 'join',
                    date: req.body.date,
                    date_int: req.body.date_int
                });
                comunication.save();
                const analytics = new Analytics ({
                    userid: newuser._id,
                    auid: req.body.auid
                });
                analytics.save();
                mail.sendMail('join', newuser.language, newuser.email,
                    {
                        'locale': newuser.language,
                        'name': newuser.name,
                        'email': newuser.email,
                        'url': 'http://localhost:3000/api/user/join/confirm/' + newuser.email
                    }
                );
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

                Analytics.findOne({userid: user._id}, function (error, userAnalytics) {
                    const comunicationEmail = new Comunication ({
                        auid: userAnalytics.auid,
                        channel: 'landingPage',
                        type: 'email_confirm',
                        date: dateString(),
                        date_int: dateInt()
                    });
                    comunicationEmail.save();
                    mail.sendMail('email_confirm', user.language, user.email,
                    {
                        'locale': user.language,
                        'name': user.name,
                        'email': user.email
                    }
                );

                    const comunicationCode = new Comunication ({
                        auid: userAnalytics.auid,
                        channel: 'landingPage',
                        type: 'code',
                        date: dateString(),
                        date_int: dateInt()
                    });
                    comunicationCode.save();

                    generateCode = user.email.substring(0,2) + '-' + uniqid.time().toUpperCase();

                    mail.sendMail('code', user.language, user.email,
                    {
                        'locale': user.language,
                        'name': user.name,
                        'code': generateCode
                    });

                    const promotion = new Promotion ({
                        auid: userAnalytics.auid,
                        type: 'code',
                        code: generateCode,
                        date_expired: '2019-12-31 00:00',
                        date_expired_int: 20191231
                    });
                    promotion.save();
                });

                res.render('home', {message: 'Your email is confirmed'});
              });
        } else {         
            res.render('home', {message: 'It was imposible to confirm :('});
        }
    });
});

app.post('/api/contact', (req, res, next) => {
    const contact = new Contact ({
        auid: req.body.auid,
        email: req.body.email,
        language: req.body.language,
        message: req.body.message,
        date: req.body.date,
        date_int: req.body.date_int
        });
        contact.save().then(() => {
            const comunication = new Comunication ({
                auid: req.body.auid,
                channel: 'landingPage',
                type: 'contact',
                date: req.body.date,
                date_int: req.body.date_int
            });
            comunication.save();
            mail.sendMail('contact', req.body.language, req.body.email,
                    {
                        'email': req.body.email,
                        'message': req.body.message
                    });
            res.status(201).send({message: 'Mail sent'});
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