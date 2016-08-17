User = require('../models/User.js');
Comment = require('../models/Comment.js');

exports.addUser = function(req, res) {
    var apikey = req.body.appid;

  var user = new User({

      comments: [{}]
  });
  user.username = req.body.username;
  user.password = req.body.password;
  user.email = req.body.email;
  user.save(function(err) {
      if (err) {
          res.json(err);
      } else {
          res.json("Success: New user added!");
      }
  })
}
/*This is a simple way to get a user with a hashed password authed that I
don't use in the app anymore. The one I use now is /getUserAuthed (scroll down).
*/
exports.getUser = function(req, res) {
    //state = req.params.state;
    username = req.query.username;
    password = req.query.password;

        User.findOne({ username: req.query.username }, function(err, user) {
            if (err) throw err;

            user.comparePassword(req.query.password, function(err, isMatch) {
              if (err) throw err;
              //If passwrods didn't match
              if(!isMatch){
                user.incLoginAttempts();
                res.json("failure");
              }
              else{
                res.json("success");
              }
              console.log(req.query.password, isMatch); // -&gt; Password123: true
          });

        });
};


/*The authorization that I currently use*/
exports.getUserAuthed = function(req, res) {
  User.getAuthenticated(req.query.username, req.query.password, function(err, user, reason) {
        if (err) throw err;

        // login was successful if we have a user
        if (user) {
            // handle login success
            res.json("Success!");
            return;
        }

        // otherwise we can determine why we failed
        var reasons = User.failedLogin;
        switch (reason) {
            case reasons.NOT_FOUND:
              res.json("USER NOT FOUND");
            case reasons.PASSWORD_INCORRECT:
                  res.json("PASSWORD BAD");
                break;
            case reasons.MAX_ATTEMPTS:
                // send email or otherwise notify user that account is
                // temporarily locked
                  res.json("MAX ATTEMPTS");
                break;
        }
    });
};
