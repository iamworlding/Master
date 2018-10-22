const Email = require('email-templates');
const path = require('path');

exports.sendMail = function (languageEmail, typeEmail, nameEmail, fromEmail) {

email = new Email({
  message: {
    from: 'iamworlding@gmail.com'
  },
  // uncomment below to send emails in development/test env:
  // send: true,
  transport: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: 'iamworlding@gmail.com',
        pass: 'Novena1990@'
    }
  },
  views: {
    options: {
      extension: 'hbs' // <---- HERE
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
    locals: {
      locale: languageEmail,
      name: nameEmail,
      email: fromEmail,
      url: "localhost:3000/api/user/join/confirm/" + fromEmail
    }
  })
  .then(console.log)
  .catch(console.error);
};