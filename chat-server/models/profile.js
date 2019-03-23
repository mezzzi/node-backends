var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProfileSchema = new Schema({

    username: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },
    
    email: {
        type: String,
        required: true
    },

    phone: {
        type: String,
    },    

    address: {
        type: String,
    },

    disease: {
        type: String,
    },

});


module.exports = mongoose.model('Profile', ProfileSchema);