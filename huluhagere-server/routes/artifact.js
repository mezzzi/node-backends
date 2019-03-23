const mongoose = require('mongoose');
const express = require("express");

const artifactManager = require('../models/artifactManager');

const router = express.Router();


// add an artifact
router.get('/all/', function (req, res) {

    artifactManager.findAll(
        function (artifacts) {
            res.json({
                success: true,
                artifacts: artifacts
            });
        },
        function (err) {
            res.json({
                success: false,
                err: err
            });
        }
    );

})

module.exports = {
    router: router
};