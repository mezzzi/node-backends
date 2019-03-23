const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AddressSchema = require('./address').schema;
let ArtifactSchema = require('./artifact').schema;
let ServiceSchema = require('./service').schema;

let PreferenceSchema = new Schema({
    tags: {
        type: [String]
    },
    services: {
        type: [ServiceSchema]
    },
    artifacts: {
        type: [ArtifactSchema]
    },
    locations: {
        type: [AddressSchema]
    },
    duration: {
        type: Number
    }
});

module.exports = {
    model: mongoose.model('Preference', PreferenceSchema),
    schema: PreferenceSchema
}
