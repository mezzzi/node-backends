let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PracSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    url: {
        type: String,
        default: "http://localhost:8000/whatever"
    },
    artifacts: [{
        name: String,
        tag: String
    }]
});

module.exports = mongoose.model('Prac', PracSchema);