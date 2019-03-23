const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ServiceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    service_level: {
        type: Number,
        required: true
    },
    category: {
        type: [String]    
    }    
});

module.exports = {
    model: mongoose.model('Service', ServiceSchema),
    schema: ServiceSchema
}