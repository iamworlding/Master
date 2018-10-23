const Email = require('email-templates');
const path = require('path');

exports.sendMail = function (typeEmail, languageEmail, fromEmail, dataLocale) {

email = new Email({
  message: {
    from: 'iamworlding@gmail.com'
  },
  // send: true,
  transport: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'iamworlding@gmail.com',
        pass: 'Novena1990@'
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