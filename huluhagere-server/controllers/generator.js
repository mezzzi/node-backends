let Site = require('../models/site').model;

module.exports = {

    generate: function (preference, sucessCB, failureCB) {
        
        console.log(JSON.stringify(preference));

        Site.find({},

            function (err, sites) {

                if (err) {
                    failureCB(err);
                } else {
                    
                    // for now, preference is reflected in the roadmap
                    // by selecting activity sites (cities) that most
                    // suit the user's needs
                    let cities = [];

                    // account for a swimming interest
                    let services = preference.services;
                    for(let i = 0; i < services.length; i++) {
                        if(services[i] === 'swimming') {
                            cities.push('Hawassa');
                            break;
                        }
                    }

                    // accomodate for his prefered locations
                    let locations = preference.locations;
                    let loc_to_city = {
                        'addisababa': 'Addis Ababa',
                        'mekelle': 'Mekelle',
                        'hawassa': 'Hawassa',
                        'bahirdar': 'Bahirdar',
                        'adama': 'Adama'
                    };                    
                    let location = '';
                    for(let i = 0; i < locations.length; i++) {
                        location = locations[i].city.trim();
                        cities.push(loc_to_city[location]);
                    }

                    // include the city hosting the desired artifact
                    let art_to_city = {
                        'castle': 'Gondar',
                        'church': 'Lalibella',
                        'museum': 'Addis Ababa',
                        'cave': 'Harar',
                        'mosque': 'Harar'
                    };
                    let artifacts = preference.artifacts;

                    let city = 'Harar';
                    let art = '';
                    for(let i = 0; i < artifacts.length; i++) {
                        art = artifacts[i].name.trim();
                        city = art_to_city[art];
                        if(city !== undefined) {
                            cities.push(city);
                        }
                    }

                    let activities = [];
                    let activity, startTime, endTime;
                    
                    let sites_length = sites.length;
                    let cities_length = cities.length;
                    // populate the activities list
                    let num_days = parseInt(preference.duration);                                        
                    for(i = 0; i < num_days; i++) {
                        activity = {};
                        if(i < cities_length) {
                            activity.site = {
                                "name": cities[i]
                            };
                        } else {
                            activity.site = sites[i%sites_length];
                        }
                        startTime = new Date();
                        activity.startTime = startTime;
                        endTime = startTime;
                        endTime.setHours(
                            (startTime.getHours() + 5) % 24
                        );
                        activity.endTime = endTime;
                        activities.push(activity);
                    }

                    // prepare and send back the roadmap
                    let roadmap = {};
                    roadmap.activities = activities;
                    roadmap.email = "guest@freeworld.com";
                    roadmap.name = "Untitled Roadmap";
                    sucessCB(roadmap);

                }
            });

    }

}