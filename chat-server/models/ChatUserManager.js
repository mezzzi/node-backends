var ChatUser = require('./chat_user');

module.exports = {

    getAllUsers: function (sucessCB, failureCB) {
        ChatUser.find({}, function (err, usrs) {
            if (err) {
                failureCB(err);
            } else {
                sucessCB(usrs);
            }
        });
    },

    findUser: function (reqUser, sucessCB, failureCB) {
        ChatUser.findOne({
            name: reqUser.name
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

    registerUser: function (reqUser, sucessCB, failureCB) {

        if (!reqUser || !reqUser.id || !reqUser.name || !reqUser.avatar) {
            failureCB();
        } else {
            var newUser = new ChatUser(reqUser);
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