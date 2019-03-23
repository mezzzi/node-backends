const mongoose = require('mongoose');
const express = require("express");

const forumManager = require('../models/forumManager');

const router = express.Router();

router.post('/save-post/', function (req, res) {

  forumManager.savePost(req.body,
    function (pst) {
      res.json({
        success: true,
        post: pst,
      });
    },
    function () {
      res.json({
        success: false
      });
    })

});

router.post('/save-comment/', function (req, res) {

  forumManager.saveComment(
    req.body.comment,
    req.body.question_id,
    function (pst) {
      res.json({
        success: true,
        post: pst
      });
    },
    function () {
      res.json({
        success: false,
      });
    }
  );

})

router.post('/all/', function (req, res) {

  forumManager.getPosts(
    function (psts) {
      res.json({
        success: true,
        posts: psts
      });
    },
    function () {
      res.json({
        success: false,
      });
    }
  );

})


router.post('/fetch/', function (req, res) {

  forumManager.fetchPosts(
    req.body.patient_username,
    function (psts) {
      res.json({
        success: true,
        posts: psts
      });
    },
    function () {
      res.json({
        success: false,
      });
    }
  );

});

router.post('/get/', function (req, res) {

  forumManager.getPost(
    req.body.post_id,
    function (pst) {
      res.json({
        success: true,
        post: pst
      });
    },
    function () {
      res.json({
        success: false,
      });
    }
  );

});

router.post('/search/', function (req, res) {

  forumManager.searchPosts(
    req.body.search_term,
    function (psts) {
      res.json({
        success: true,
        posts: psts
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
