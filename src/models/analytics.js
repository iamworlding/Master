const mongosee = require('mongoose');

const analyticsSchema = mongosee.Schema({
    userid: { type: String},
    auid: { type: String },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongosee.model('Analytics', analyticsSchema);