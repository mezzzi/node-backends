const mongoose = require('mongoose');
const config = require('../config/database');
const express = require("express");

const pracManager = require('../models/pracManager');

const router = express.Router();

// register a user
router.post('/save/', function (req, res) {

    // print for debugging
    console.log(JSON.stringify(req.body));

    pracManager.savePrac(
        req.body,
        function () {
            res.json({
                success: true,
            });
        },
        function (err) {
            res.json({
                success: false,
            });
        }
    );

})

// add an artifact
router.post('/add/', function (req, res) {

    // print for debugging
    console.log(JSON.stringify(req.body.artifact));

    pracManager.addArtifact(
        req.body.name,
        req.body.artifact,
        function () {
            res.json({
                success: true,
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

// add an artifact
router.get('/all/', function (req, res) {

    pracManager.findAll(
        function (pracs) {
            res.json({
                success: true,
                pracs: pracs
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