let RoadMap = require('./roadmap').model;

module.exports = {

    saveRoadmap: function (req, sucessCB, failureCB) {

        if (!req || !req.activities || !req.email ) {
            failureCB("required arguments not provided");
        } else {
            let roadmap = new RoadMap(req);
            // save the user
            roadmap.save(function (err, rmp) {
                if (err) {
                    failureCB(err);
                } else {
                    sucessCB();
                }
            });
        }

    },

    findAll: function (email, sucessCB, failureCB) {

        if (!email) {
            failureCB("Email argument not provided");
        } else {
            RoadMap.find({
                    email: email
                },
                function (err, roadmaps) {
                    if (err) {
                        failureCB(err);
                    } else {
                        sucessCB(roadmaps);
                    }
                });
        }

    },

    addActivity: function (id, activity, sucessCB, failureCB) {

        if (!id || !activity) {
            failureCB("Required arguments not provided");
        } else {
            RoadMap.findById(
                id,
                function (err, obj) {
                    if (err) {
                        failureCB(err);
                    } else {
                        obj.activities.push(activity);
                        obj.save(function (err, roadmap) {
                            if (err) {
                                failureCB(err);
                            } else {
                                sucessCB();
                            }
                        });
                    }
                });
        }

    },

    removeActivity: function (roadmap_id, activity_id, sucessCB, failureCB) {

        if (!roadmap_id || !activity_id) {
            failureCB("Required arguments not provided");
        } else {
            RoadMap.findById(
                roadmap_id,
                function (err, obj) {
                    if (err) {
                        failureCB(err);
                    } else {
                        let index = -1;
                        for (i = 0; i < obj.activities.length; i++) {
                            if (obj.activities[i]._id === activity_id) {
                                index = i;
                            }
                        }
                        if (index !== -1) {
                            obj.activities.splice(index, 1);
                            obj.save(function (err, roadmap) {
                                if (err) {
                                    failureCB(err);
                                } else {
                                    sucessCB();
                                }
                            });
                        } else {
                            failureCB("Index of activity could not be matched");
                        }
                    }
                });
        }

    },

    removeRoadmap: function (name, sucessCB, failureCB) {

        if (!name) {
            failureCB("Required arguments not provided");
        } else {
            RoadMap.remove(
                {
                    name: name
                }
                ,
                function (err, obj) {
                    if (err) {
                        failureCB(err);
                    } else {
                        sucessCB();
                    }
                });
        }

    }

}