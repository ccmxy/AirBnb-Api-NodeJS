//Route file
Listing = require('../models/Listing.js');
APIKey = require('../models/APIKey.js');
Comment = require('../models/Comment.js');

// GET all listings in web interface
exports.getAllListings = function(req, res) {
    Listing.find({}, function(err, docs) {
        res.json(docs);
    });
    res.json
};

//Homepage in web interface
exports.index = function(req, res) {
    Listing.find({}, function(err, docs) {
        res.render('indexlisting', {
            "listings": docs
        });
    });
};

//View tests in web interface
exports.testView = function(req, res) {
    res.render('testview');
}

//Triggered by generate api button on /test in web interface
exports.startTest = function(req, res) {
    var apikey = new APIKey();
    apikey.key = createKey();
    apikey.save(function(err) {
        if (err) {
            callback(err);
        } else {
            res.render('testview', {
                yourKey: apikey.key

            });
        }
    });
}

//Triggered by generate api button on /api in web interface
exports.getkey = function(req, res) {
    var apikey = new APIKey();
    apikey.key = createKey();
    apikey.save(function(err) {
        if (err) {
            callback(err);
        } else {
            res.render('apiview', {
                yourKey: apikey.key

            });
        }
    });
}

//api view page on web interface
exports.api = function(req, res) {
    res.render('apiview');
};

//registration form page on web interface
exports.regformlisting = function(req, res) {
    res.render('regformlisting');
};

//View individual listing from web interface
exports.view = function(req, res) {
    id = req.params.id;

    Listing.find({
        _id: id
    }, function(err, docs) {
        res.render('viewlisting', {
            "listings": docs
        });
    });
};

//Render the edit page in web interface
exports.edit = function(req, res) {
    id = req.params.id;
    Listing.find({
        _id: id
    }, function(err, docs) {
        res.render('editlisting', {
            "listings": docs
        });
    });
};

//Delete from web interface
exports.delete = function(req, res) {
    var id = req.params.id;
    Comment.find({
        listing_id: id
    }).remove(function(err, doc) {
        if (err) {
            console.log(err);
        }
    });
    Listing.find({
        _id: id
    }).remove(function() {
        res.redirect('/');
    });
};

// /deleteListing API route
exports.deleteListing = function(req, res) {
    var apikey = req.body.appid;
    APIKey.find({
        key: apikey
    }, function(err, docs) {
        if (err) {
            res.json(err);
        }
        if (!docs.length) {
            res.json("INVALID API KEY")
        }
        if (docs.length) {
            if (req.body.id) {
                id = req.body.id;
                Listing.find({
                    _id: id
                }).remove(function(err, docs) {
                    if (err) {
                        res.json(err)
                    }
                    if (docs.result.n < 1) {
                        res.json("Failure: Listing with id " + id + " not found in database.");
                    } else {
                        Comment.find({
                            listing_id: id
                        }).remove(function(err, doc) {
                            if (err) {
                                res.json(err);
                            }
                        });
                        res.json("Success: Listing with id " + id + " removed from database.");
                    }
                });
            } else if (req.body.name) {
                name = req.body.name;
                Listing.find({
                    name: name
                }).remove(function(err, docs) {
                    if (err) {
                        res.json(err);
                    }
                    if (docs.result.n < 1) {
                        res.json("Failure: Listing with the name " + name + " was not found in database.")
                    } else {
                        Comment.find({
                            listing_name: name
                        }).remove(function(err, doc) {
                            if (err) {
                                res.json(err);
                            }
                        });
                        res.json("Success: Listing " + name + " removed from database.");
                    }
                });
            }

        }

    })

}

//Update used in web-interface (triggered by pressing save from editlisting page)
exports.update = function(req, res) {
    var conditions = {
            _id: req.body.id
        },
        update = {
            location: {
                state: req.body.state,
                city: req.body.city
            },
            name: req.body.name,
            noGuests: req.body.noGuests,
            price: req.body.price
        },
        options = {
            multi: false
        };

    Listing.update(conditions, update, options, callback);

    function callback(err, numAffected) {
        if (err) {
            throw err;
        }
        res.redirect('/');
    };
}


// /putListing API route
exports.changelisting = function(req, res) {
    var apikey = req.body.appid;
    APIKey.find({
        key: apikey
    }, function(err, docs) {
        if (err) {
            res.json(err);
        }
        if (!docs.length) {
            res.json("Invalid API Key");
        }
        if (docs.length) {
            if (req.body.id) { //Update by id

                var conditions = {
                        _id: req.body.id
                    },
                    update = {
                        location: {
                            state: req.body.state,
                            city: req.body.city
                        },
                        name: req.body.name,
                        noGuests: req.body.noGuests,
                        price: req.body.price
                    },
                    options = {
                        multi: false
                    };

                Listing.update(conditions, update, options, callback);

                function callback(err, numAffected) {
                    if (err) {
                        res.json(err);
                    }

                    res.json('Success: Listing with id ' + req.body.id + ' updated in database.');
                };
            }
            if (req.body.name) { //Update by name

                var conditions = {
                        name: req.body.name
                    },
                    update = {
                        location: {
                            state: req.body.state,
                            city: req.body.city
                        },
                        noGuests: req.body.noGuests,
                        price: req.body.price
                    },
                    options = {
                        multi: false
                    };

                Listing.update(conditions, update, options, callback);

                function callback(err, numAffected) {
                    if (err) {
                        res.json(err);
                    } else {
                        if (numAffected.n) {
                            res.json('Success: Listing with name ' + req.body.name + ' updated in database.');
                        } else {
                            res.json('Failure: Listing with name ' + req.body.name + ' not found in database.');
                        }
                    }
                };
            } else {
                res.json("Error: Please supply either name= or an ID= in your request.")
            }
        }
    });
}

// /postListing API route
exports.addlisting = function(req, res) {
    var apikey = req.body.appid;
    APIKey.find({
        key: apikey
    }, function(err, docs) {
        if (err) {
            res.json(err);
        }
        if (!docs.length) {
            res.json("Invalid API Key");
        }
        if (docs.length) {
            var listing = new Listing({
                location: {
                    city: req.body.city,
                    state: req.body.state
                },
                // comments: [{}]
            });
            listing.name = req.body.name;
            listing.noGuests = req.body.noGuests;
            listing.price = req.body.price;
            listing.location.city = req.body.city;
            listing.location.state = req.body.state;
            listing.author = req.body.author;
            listing.save(function(err) {
                if (err) {
                    res.json(err);
                } else {
                    res.json("Success: New listing posted.");
                }
            })
        }
    });
}

// register in web interfae (triggered by pressing register button in registration form)
exports.register = function(req, res) {
    var listing = new Listing({
        location: {
            city: req.body.city,
            state: req.body.state
        }
    });
    listing.name = req.body.name;
    listing.noGuests = req.body.noGuests;
    listing.price = req.body.price;
    listing.location.city = req.body.city;
    listing.location.state = req.body.state;
    listing.save(function(err) {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/');
        }
    });
}

// /getListingByLocation API route
exports.location = function(req, res) {
    //state = req.params.state;
    state = req.query.state;
    city = req.query.city;
    if (city && state) {
        Listing.find({
            'location.state': state,
            'location.city': city
        }, function(err, docs) {
            res.json(docs);
        });
        res.json
    } else if (state) {
        Listing.find({
            'location.state': state
        }, function(err, docs) {
            res.json(docs);
        });
        res.json
    } else if (city) {
        Listing.find({
            'location.city': city
        }, function(err, docs) {
            res.json(docs);
        });
        res.json
    } else {
        res.json("None found for that request.");
    }
};

// /getListingByName API route
exports.getListingByName = function(req, res) {
    //state = req.params.state;
    name = req.query.name;

        Listing.find({
            'name': name
                  }, function(err, docs) {
            res.json(docs);
        });
};


// /getListingByName API route
exports.getListingByAuthor = function(req, res) {
    //state = req.params.state;
    author = req.query.author;

        Listing.find({
            'author': author
                  }, function(err, docs) {
            res.json(docs);
        });
};

//Make API Key
function createKey() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
