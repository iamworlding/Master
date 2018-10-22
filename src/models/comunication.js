const mongosee = require('mongoose');

const comunicationsSchema = mongosee.Schema({
    userid: { type: String},
    channel: { type: String },
    type: { type: String },
    date: { type: String },
    date_int: { type: Number },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongosee.model('Comunication', comunicationsSchema);