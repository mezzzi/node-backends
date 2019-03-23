const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ActivitySchema = require('./activity').schema;
let PreferenceSchema = require('./preference').schema;

let RoadMapSchema = new Schema({
    name: {
        type: String,
        default: "Untitled Roadmap"
    },
    email: {
        type: String,
        required: true
    },
    activities: {
        type: [ActivitySchema],
        required: true
    }
});

module.exports = {
    model: mongoose.model('RoadMap', RoadMapSchema),
    schema: RoadMapSchema
}