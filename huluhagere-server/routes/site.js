const mongoose = require('mongoose');
const config = require('../config/database');
const express = require("express");

const siteManager = require('../models/siteManager');

const router = express.Router();

router.post('/save/', function (req, res) {

    // print for debugging
    console.log(JSON.stringify(req.body));

    siteManager.save(
        req.body,
        function () {
            res.json({
                success: true,
                message: "successfully saved",
                error: ""
            });
        },
        function (err) {
            res.json({
                success: false,
                message: "not saved",
                error: err
            });
        }
    );

})

router.get('/all/', function (req, res) {

    siteManager.findAll(
        function (sites) {
            res.json(sites);
        },
        function (err) {
            res.json({
                success: false,
                err: err,
                message: "Sites could not be fetched"
            });
        }
    );

})

router.get('/one/', function (req, res) {

    console.log(req.query.name);

    siteManager.findOne(
        req.query.name,
        function (site) {
            res.json(site);
        },
        function (err) {
            res.json({
                success: false,
                err: err,
                message: "not found"
            });
        }
    );

})

router.post('/add-artifact/', function (req, res) {

    // print for debugging
    console.log(JSON.stringify(req.body.artifact));

    siteManager.addArtifact(
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

router.post('/add-service/', function (req, res) {

    // print for debugging
    console.log(JSON.stringify(req.body.service));

    siteManager.addService(
        req.body.name,
        req.body.service,
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

router.post('/add-working-day/', function (req, res) {

    // print for debugging
    console.log(JSON.stringify(req.body.day));

    siteManager.addWorkingDay(
        req.body.name,
        req.body.day,
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

router.post('/update/', function (req, res) {

    // print for debugging
    console.log(JSON.stringify(req.body));

    siteManager.update(
        req.body.name,
        req.body.update,
        function () {
            res.json({
                success: true,
                message: "successfully updated",
                error: "'"
            });
        },
        function (err) {
            res.json({
                success: false,
                message: "not updated",
                error: err
            });
        }
    );

})

router.post('/remove/', function (req, res) {

    // print for debugging
    console.log(JSON.stringify(req.body));

    siteManager.remove(
        req.body.name,
        function () {
            res.json({
                success: true,
                message: "successfully removed",
                error: "'"
            });
        },
        function (err) {
            res.json({
                success: false,
                message: "not removed",
                error: err
            });
        }
    );

})

module.exports = {
    router: router
};