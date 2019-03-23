let Artifact = require('./artifact').model;

module.exports = {

    findAll: function (sucessCB, failureCB) {

            Artifact.find({},
                function (err, pracs) {
                if (err) {
                    failureCB(err);
                } else {
                    sucessCB(pracs);
                }
            });
        

    }     

}

