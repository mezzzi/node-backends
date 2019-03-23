const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ArtifactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: true
    }
});

module.exports = {
    model: mongoose.model('Artifact', ArtifactSchema),
    schema: ArtifactSchema
}