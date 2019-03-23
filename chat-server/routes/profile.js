const mongoose = require('mongoose');
const express = require("express");

const profileManager = require('../models/profileManager');

const router = express.Router();

router.post('/save/', function (req, res) {

    profileManager.saveProfile(req.body, 
    function(prof) {
        res.json({
            success: true,
            profile: prof,
        });
    },
    function() {
        res.json({
            success: false
        });
    })

});

router.post('/update/', function (req, res) {

    profileManager.updateProfile(req.body, 
    function(prof) {
        res.json({
            success: true,
            profile: prof,
        });
    },
    function() {
        res.json({
            success: false
        });
    })

});

router.post('/fetch/', function (req, res) {

    profileManager.getProfile(
        req.body.username,
        function (prof) {
            res.json({
                success: true,
                profile: prof
            });
        },
        function () {
            res.json({
                success: false,
            });
        }
    );

})

module.exports = {
    router: router
};