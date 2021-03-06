const mongosee = require('mongoose');

const usersSchema = mongosee.Schema({
    name: { type: String },
    email: { type: String },
    email_confirm: { type: Boolean, default: false},
    language: { type: String },
    date: { type: String },
    date_int: { type: Number },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongosee.model('User', usersSchema);