var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({

    from: {
        type: String,
        required: true
    },

    to: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },
    
    date: {
        type: Date,
        required: true
    }
    
});


module.exports = mongoose.model('Message', MessageSchema);