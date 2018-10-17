const mongosee = require('mongoose');

const eventsSchema = mongosee.Schema({
    auid: { type: String },
    origin: { type: String },
    data_date: { type: Date },
    user: {
        ip: { type: String },
        referer: { type: String },
        url: { type: String },
        lat: { type: Number },
        lon: { type: Number },
        city: { type: String },
        zip: { type: String },
        country: { type: String },
        agent: {
            userAgent: { type: String },
            os: { type: String },
            browser: { type: String },
            device: { type: String },
            os_version: { type: String },
            browser_version: { type: String },
        }
    },
    date: { type: Date, default: Date.now },
});

module.exports = mongosee.model('Events', eventsSchema);
