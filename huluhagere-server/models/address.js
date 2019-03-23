const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AddressSchema = new Schema({
    region: {
        type: String
    },
    zone: {
        type: String
    },
    kebele: {
        type: String
    },
    street: {
        type: String
    },      
});

module.exports = {
    model: mongoose.model('Address', AddressSchema),
    schema: AddressSchema
}