var Profile = require('./profile');

module.exports = {

    getProfile: function (username, sucessCB, failureCB) {
        Profile.findOne({
                username: username
            },
            function (err, prof) {
                if (err) {
                    failureCB();
                } else {
                    sucessCB(prof);
                }
            })
    },

    saveProfile: function (profile, sucessCB, failureCB) {

        if (!profile) {
            failureCB();
        } else {
            let newProfile = new Profile({
                username: profile.username,
                name: profile.name,
                email: profile.email,
                phone: profile.phone,
                address: profile.address,
                disease: profile.disease
            });
            // save the user
            newProfile.save(function (err, prof) {
                if (err) {
                    failureCB();
                } else {
                    sucessCB(prof);
                }
            });
        }

    },

    updateProfile: function (profile, sucessCB, failureCB) {

        if (!profile) {
            failureCB();
        } else {
            Profile.findOne({username: profile.username}, function (err, forum) {
                if (err) {
                    failureCB();
                } else {
                    forum.update({
                        username: profile.username,
                        name: profile.name,
                        email: profile.email,
                        phone: profile.phone,
                        address: profile.address,
                        disease: profile.disease
                    }, function (err, forum) {
                        if (err) {
                            failureCB();
                        } else {
                            sucessCB();
                        }
                    });
                }
            });

        }

    },

    getPosts: function (sucessCB, failureCB) {
        Forum.find({}, function (err, forums) {
            if (err) {
                failureCB();
            } else {
                sucessCB(forums);
            }
        })
    }
}