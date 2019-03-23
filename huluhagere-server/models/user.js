const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = {
    model: mongoose.model('SimpleUser', UserSchema),
    schema: UserSchema
}