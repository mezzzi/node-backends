const Message = require('./message');

module.exports = {

    getMessages: function (session_id, sucessCB, failureCB) {
        Message.find({session_id: session_id}, function (err, msgs) {
            if (err) {
                failureCB();
            } else {
                sucessCB(msgs);
            }
        })
    },

    saveMessage: function (msg, sucessCB, failureCB) {

        if (!msg) {
            failureCB();
        } else {
            let newMsg = new Message(msg);
            newMsg.save(function (err, msg) {
                if (err) {
                    failureCB();
                } else {
                    sucessCB(msg);
                }
            });
        }

    },

    removeMessage: function (id, sucessCB, failureCB) {

        if (!msg) {
            failureCB();
        } else {
            Message.remove({
                id: id
            }, function (err) {
                if (err) {
                    failureCB();
                } else {
                    sucessCB();
                }
            });
        }

    },

}