var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ForumSchema = new Schema({

    patient_username: {
        type: String,
        required: true
    },

    question: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    comments : [{
        commenter: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        }
    } ],
    
    date: {
        type: Date,
        required: true
    }
});


module.exports = mongoose.model('Forum', ForumSchema);