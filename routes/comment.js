Comment = require('../models/Comment.js');
Listing = require('../models/Listing.js');

exports.getAllComments = function(req, res) {
    Comment.find({}, function(err, docs) {
        res.json(docs);
    });
    res.json
};

// /getListingByName API route
exports.getCommentsByAuthor = function(req, res) {
    author = req.query.author;

        Comment.find({
            'author': author
                  }, function(err, docs) {
            res.json(docs);
        });
};

exports.postCommentUser = function(req, res) {
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
            if (req.body.words != "") {
                var comment = {
                    words: req.body.words,
                    listing_name: req.body.listing_name,
                    author: req.body.author
                }
                Comment.create(comment, function(err, category) {
                    if (err) console.log(err);
                    Listing.findOne({
                        name: req.body.listing_name
                    }, function(err, docs) {
                        if (err) {
                            res.json(err);
                        }
                        docs.comments.push(comment);
                        docs.save(function(err) {
                            if (err) return handleError(err)
                            res.json('Success! Comment added to listing ' + req.body.listing_name);
                        });
                    });
                });
            } else {
                res.json("Failure: You did not include a comment body.");
            }
        }
    });
}

exports.addcomment = function(req, res) {
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
            if (req.body.words != "") {
                var comment = {
                    words: req.body.words,
                    listing_name: req.body.listing_name,
                }
                Comment.create(comment, function(err, category) {
                    if (err) console.log(err);
                    Listing.findOne({
                        name: req.body.listing_name
                    }, function(err, docs) {
                        if (err) {
                            res.json(err);
                        }
                        docs.comments.push(comment);
                        docs.save(function(err) {
                            if (err) return handleError(err)
                            res.json('Success! Comment added to listing ' + req.body.listing_name);
                        });
                    });
                });
            } else {
                res.json("Failure: You did not include a comment body.");
            }
        }
    });
}


//Method to add comment by id
exports.addcommentwithoutkey = function(req, res) {

    console.log(req.body.listing_id);
    console.log(req.body.words);
    if (req.body.words != "") {
        var comment = {
            words: req.body.words,
            listing_id: req.body.listing_id,
            listing_name: req.body.listing_name
        }

        Comment.create(comment, function(err, category) {
            if (err) console.log(err);
            Listing.findOne({
                _id: req.body.listing_id
            }, function(err, docs) {
                if (err) {
                    res.json(err);
                }
                docs.comments.push(comment);
                docs.save(function(err) {
                    if (err) return handleError(err)
                    console.log('Success! Comment added to listing with id ' + req.body.listing_id);
                    res.redirect("/view/" + req.body.listing_id);
                });
            });
        });
    } else {
        res.json("Failure: You did not include a comment body.");
    }

}

//Send name into get request to get the comments on the listing
exports.getCommentByListingName = function(req, res) {
  listing_name = req.name;
  Comment.find({
      'listing_name': listing_name,
            }, function(err, docs) {
              if(err){
                res.json(err)
              }
              if (docs.length) {
                  res.json(docs)
              }
              else {
                 res.json("no comments");
              }
  });


}

exports.deleteComment = function(req, res) {
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

            Comment.find({
                _id: req.body.id
            }).remove(function(err, docs) {
                if (err) {
                    res.json(err)
                }
                if (docs.results.n < 1) {
                    res.json("Failure: Comment with id " + req.body.id + " not found in database.");
                } else {
                    res.json("Success: Comment with id " + req.body.id + " removed from database.");
                }
            });
        }
    });
}
