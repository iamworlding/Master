const mongosee = require('mongoose');

const promotionsSchema = mongosee.Schema({
    userid: { type: String},
    type: { type: String },
    code: { type: String },
    used: { type: Boolean, default: false },
    date_expired: { type: String },
    date_expired_int: { type: Number },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongosee.model('Promotion', promotionsSchema);