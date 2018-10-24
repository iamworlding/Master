const Email = require('email-templates');
const path = require('path');

exports.sendMail = function (typeEmail, languageEmail, fromEmail, dataLocale) {

email = new Email({
  message: {
    from: process.env.MAIL_EMAIL
  },
  send: process.env.SEND_MAIL,
  transport: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PW
    }
  },
  views: {
    options: {
      extension: 'hbs'
    }
  },
  i18n: {}
});


email
  .send({
    template: path.join( __dirname, 'templates', typeEmail, languageEmail),
    message: {
      to: fromEmail
    },
    locals: dataLocale
  })
  // .then(console.log)
  .then()
  .catch(console.error);
};