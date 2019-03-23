let SimpleUser = require('./user').model;
let config = require('../config/database');

module.exports = {

    // returns all the users in the databse
    getAllUsers: function (sucessCB, failureCB) {
        SimpleUser.find({}, function (err, usrs) {
            if (err) {
                failureCB(err);
            } else {
                sucessCB(usrs);
            }
        });
    },

    // returns all the users in the databse
    removeAllUsers: function (sucessCB, failureCB) {
        SimpleUser.remove({}, function (err) {
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
        SimpleUser.findOne({
            email: reqUser.email
        }, function (err, user) {
            if (err) {
                failureCB(err);
            } else {
                if (!user) {
                    failureCB();
                } else {
                    // check if password matches
                    if(reqUser.password === user.password) {
                        sucessCB();
                    } else {
                        failureCB();
                    }
                }
            }
        });
    },

    // register user
    registerUser: function (reqUser, sucessCB, failureCB) {

        if (!reqUser || !reqUser.email || !reqUser.password) {
            failureCB();
        } else {
            var newUser = new SimpleUser(reqUser);
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

    // remove user
    removeUser: function (reqUser, sucessCB, failureCB) {
        SimpleUser.findOneAndRemove({
            email: reqUser.email
        }, function (err, user) {
            if (err) {
                failureCB(err);
            } else {
                sucessCB(user)
            }
        });
    },    

    // if successful, null otherwise
    searchUser: function (email, sucessCB, failureCB) {
        SimpleUser.findOne({
            email: email
        }, function (err, user) {
            if (err) {
                failureCB(err);
            } else {
                if (!user) {
                    failureCB();
                } else {
                    sucessCB(user);
                }
            }
        });
    },

    // if successful, null otherwise
    updateUser: function (old, update, sucessCB, failureCB) {
        SimpleUser.findOneAndUpdate(
        old, 
        update,
        function (err, user) {
            if (err) {
                failureCB(err);
            } else {
                if (!user) {
                    failureCB();
                } else {
                    sucessCB(user);
                }
            }
        });
    }

}

