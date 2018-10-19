const mongosee = require('mongoose');

const reportSchema = mongosee.Schema({
    _id: { type: String},
    type: { type: String },
    data: {
        labels: [String],
        datasets: [{ 
            label : { type: String },
            backgroundColor : { type: String },
            fill : { type: String },
            borderColor : { type: String },
            borderWidth : { type: String },
            data: [Number]
        }]
    },
    options: { type: String }
});

module.exports = mongosee.model('Report', reportSchema);