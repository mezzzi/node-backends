var User = require('./user');
var jwt = require('jsonwebtoken');
var config = require('../config/database');

module.exports = {

    getAllUsers: function (sucessCB, failureCB) {
        User.$where(() => {
            return this.username !== null;
        }).select('username -_id').limit(5).
        sort({username: 'asc'})
        .exec(function (err, usr) {
            if (err) {
                failureCB();
            } else {
                sucessCB(usr);
            }
        });
    },    

    findUser: function (reqUser, sucessCB, failureCB) {
        User.findOne({
            username: reqUser.username
        }, function (err, user) {
            if (err) throw err;

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
                        failureCB();
                    }
                });
            }
        });
    },

    registerUser: function (reqUser, sucessCB, failureCB) {

        if (!reqUser || !reqUser.username || !reqUser.password) {
            failureCB();
        } else {
            var newUser = new User({
                username: reqUser.username,
                password: reqUser.password
            });
            // save the user
            newUser.save(function (err) {
                if (err) {
                    failureCB();
                } else {
                    sucessCB();
                }
            });
        }

    },

}