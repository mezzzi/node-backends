var User = require('./usert');
var jwt = require('jsonwebtoken');
var config = require('../config/database');

module.exports = {

    // returns all the users in the databse
    getAllUsers: function (sucessCB, failureCB) {
        User.find({}, function (err, usrs) {
            if (err) {
                failureCB(err);
            } else {
                sucessCB(usrs);
            }
        });
    },

    // returns all the users in the databse
    removeAllUsers: function (sucessCB, failureCB) {
        User.remove({}, function (err) {
            if (err) {
                failureCB(err);
            } else {
                sucessCB();
            }
        });
    },    

    // perform login, and return the logged in user
    // if successful, null otherwise
    findUser: function (reqUser, sucessCB, failureCB) {
        User.findOne({
            email: reqUser.email
        }, function (err, user) {
            if (err) {
                failureCB(err);
            } else {
                if (!user) {
                    failureCB();
                } else {
                    // check if password matches
                    user.comparePassword(reqUser.password, function (err, isMatch) {
                        if (isMatch && !err) {
                            // if user is found and password is right create a token
                            var token = jwt.sign(user, config.secret);
                            sucessCB(token);
                        } else {
                            failureCB("Error or not matched");
                        }
                    });
                }
            }
        });
    },

    // register user
    registerUser: function (reqUser, sucessCB, failureCB) {

        if (!reqUser || !reqUser.email || !reqUser.password) {
            failureCB();
        } else {
            var newUser = new User(reqUser);
            // save the user
            newUser.save(function (err) {
                if (err) {
                    failureCB(err);
                } else {
                    sucessCB();
                }
            });
        }

    },

}

