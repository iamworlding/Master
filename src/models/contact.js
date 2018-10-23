const mongosee = require('mongoose');

const contactsSchema = mongosee.Schema({
    auid: { type: String},
    email: { type: String },
    language: { type: String },
    message: { type: String },
    date: { type: String },
    date_int: { type: Number },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongosee.model('Contact', contactsSchema);