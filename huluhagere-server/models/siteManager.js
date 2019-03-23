let Site = require('./site').model;

module.exports = {

    save: function (site, sucessCB, failureCB) {

        if (!site || !site.name) {
            failureCB("Name not provided");
        } else {
            let newSite = new Site(site);
            // save the the site
            newSite.save(function (err) {
                if (err) {
                    failureCB(err);
                } else {
                    sucessCB();
                }
            });
        }

    },

    findAll: function (sucessCB, failureCB) {

        Site.find({},
            function (err, sites) {
                if (err) {
                    failureCB(err);
                } else {
                    sucessCB(sites);
                }
            });

    },

    findOne: function (name, sucessCB, failureCB) {

        Site.findOne({name: name},
            function (err, site) {
                if (err) {
                    failureCB(err);
                } else {
                    sucessCB(site);
                }
            });

    },

    addArtifact: function (name, artifact, sucessCB, failureCB) {

        if (!name || !artifact.name || !artifact.tag) {
            failureCB(artifact);
        } else {
            Site.findOne({
                name: name
            }, function (err, obj) {
                if (err) {
                    failureCB(err);
                } else {
                    obj.artifacts.push(artifact);
                    obj.save(function (err, site) {
                        if (err) {
                            failureCB(err);
                        } else {
                            if (!site) {
                                failureCB(site);
                            } else {
                                sucessCB(site);
                            }
                        }
                    });
                }
            });
        }

    },

    addService: function (name, service, sucessCB, failureCB) {

        if (!name || !service.name || !service.category || !service.service_level) {
            failureCB("Required fields not provided!");
        } else {
            Site.findOne({
                name: name
            }, function (err, obj) {
                if (err) {
                    failureCB(err);
                } else {
                    obj.site_services.push(service);
                    obj.save(function (err, site) {
                        if (err) {
                            failureCB(err);
                        } else {
                            if (!site) {
                                failureCB(err);
                            } else {
                                sucessCB(site);
                            }
                        }
                    });
                }
            });
        }

    },

    addWorkingDay: function (name, day, sucessCB, failureCB) {

        if (!name || !day) {
            failureCB("Required fields not provided!");
        } else {
            Site.findOne({
                name: name
            }, function (err, obj) {
                if (err) {
                    failureCB(err);
                } else {
                    obj.work_days.push(new Date(day));
                    obj.save(function (err, site) {
                        if (err) {
                            failureCB(err);
                        } else {
                            if (!site) {
                                failureCB(err);
                            } else {
                                sucessCB(site);
                            }
                        }
                    });
                }
            });
        }

    },
    
    update: function(name, update, sucessCB, failureCB) {
        if(!name || !update) {
            failureCB("Required arguments not given");
        } else {
            Site.findOneAndUpdate(
                {name: name},
                update,
                function(err, site) {
                    if(err) {
                        failureCB();
                    } else {
                        sucessCB(site);
                    }
                }
            )
        }
    },

    remove: function(name, sucessCB, failureCB) {
        if(!name) {
            failureCB("Required arguments not given");
        } else {
            Site.remove(
                {name: name},
                function(err, site) {
                    if(err) {
                        failureCB();
                    } else {
                        sucessCB(site);
                    }
                }
            )
        }
    }


}