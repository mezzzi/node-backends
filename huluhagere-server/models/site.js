let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AddressSchema = require('./address').schema;
let ArtifactSchema = require('./artifact').schema;
let ServiceSchema = require('./service').schema;

let SiteSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image_url: {
        type: "String",
        default: "http://localhost:8000/sites/default.png"
    },
    address: {
        type: AddressSchema,
        default: {}
    },
    artifacts: {
        type: [ArtifactSchema],
        default: []
    },
    site_services: {
        type: [ServiceSchema],
        default: []
    } ,
    avg_cost: Number,
    opening_hour: Date,
    closing_hour: Date,
    work_days: {
        type: [Date],
        default: []
    },
    tags: {
        type: [String],
        default: []
    } 
});

module.exports = {
    model: mongoose.model('Site', SiteSchema),
    schema: SiteSchema
}