const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let SiteSchema = require('./site').schema;

let ActivitySchema = new Schema({
    site: {
        type: SiteSchema,
        required: true
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    }    
});

module.exports = {
    model: mongoose.model('Activity', ActivitySchema),
    schema: ActivitySchema
}