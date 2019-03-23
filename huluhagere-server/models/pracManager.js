let Prac = require('./prac');

module.exports = {

    savePrac: function (req, sucessCB, failureCB) {

        if (!req || !req.name) {
            failureCB("no name provided");
        } else {
            let prac = new Prac(req);
            // save the user
            prac.save(function (err) {
                if (err) {
                    failureCB(err);
                } else {
                    sucessCB();
                }
            });
        }

    },

    findAll: function (sucessCB, failureCB) {

            Prac.find({},
                function (err, pracs) {
                if (err) {
                    failureCB(err);
                } else {
                    sucessCB(pracs);
                }
            });
        

    },    

    addArtifact: function (name, artifact, sucessCB, failureCB) {

        if (!name || !artifact.name || !artifact.tag) {
            failureCB(artifact);
        } else {
            Prac.findOne({
                name: name
            }, function(err, obj) {
                if(err) {
                    failureCB(err);
                } else {
                    obj.artifacts.push(artifact);
                    obj.save(function(err, prac) {
                        if (err) {
                            failureCB(err);
                        } else {
                            if (!prac) {
                                failureCB(prac);
                            } else {
                                sucessCB(prac);
                            }
                        }                        
                    });
                }
            });
        }

    }    

}

