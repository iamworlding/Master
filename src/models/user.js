const mongosee = require('mongoose');

const usersSchema = mongosee.Schema({
    auid: { type: String},
    name: { type: String },
    email: { type: String },
    email_confirm: { type: Boolean, default: false},
    language: { type: String },
    date: { type: String },
    date_int: { type: Number }
});

module.exports = mongosee.model('User', usersSchema);