var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({

    session_id: {
        type: String,
        required: true
    },

    id: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    },    

    text: {
        type: String,
    },
    
    createdAt: {
        type: Date,
        required: true
    },

    image: {
        type: String,
    },
    
    voice: {
        type: String,
    }    
    
});


module.exports = mongoose.model('Message', MessageSchema);