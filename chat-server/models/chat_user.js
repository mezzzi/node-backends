var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatUserSchema = new Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    }    
});

module.exports = mongoose.model('ChatUser', ChatUserSchema);