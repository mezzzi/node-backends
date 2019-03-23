const Message = require('./message');

module.exports = {

    getMessages: function(usrA, usrB, sucessCB, failureCB) {
        Message.find({}, function(err, msgs) {
            if(err) {
                failureCB();
            } else {
                let messages = [];
                for(let msg of msgs) {
                    if((msg.to === usrA && msg.from === usrB) || (msg.to === usrB && msg.from === usrA)) {
                        messages.push(msg);
                    }
                }
                sucessCB(messages);
            }
        })
    },

    saveMessage: function (msg, sucessCB, failureCB) {

        if (!msg) {
            failureCB();
        } else {
            let newMsg = new Message({
                from: msg.from,
                to: msg.to,
                content: msg.content,
                date: msg.date
            });
            // save the user
            newMsg.save(function (err, msg) {
                if (err) {
                    failureCB();
                } else {
                    sucessCB(msg);
                }
            });
        }

    },

}
