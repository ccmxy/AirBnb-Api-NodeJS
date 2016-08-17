var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var listing = require('./routes/listing');
var user = require('./routes/user');

var comment = require('./routes/comment');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Get routes for web interface:
app.get('/', listing.index);
app.get('/api', listing.api);
app.get('/regform', listing.regformlisting);
app.get('/getkey', listing.getkey);
app.get('/startTest', listing.startTest);
app.get('/test', listing.testView);
app.get('/view/:id', listing.view);
app.get('/edit/:id', listing.edit);
app.get('/delete/:id', listing.delete);

//Get API Routes:
app.get('/getAllListings', listing.getAllListings);
app.get('/getAllComments', comment.getAllComments);
app.get('/getListingsByLocation/', listing.location);
app.get('/getListingByName/', listing.getListingByName);
app.get('/getListingByAuthor/', listing.getListingByAuthor);
app.get('/getUser', user.getUser);
app.get('/getUserAuthed', user.getUserAuthed);
app.get('/getCommentByListingName', comment.getCommentByListingName);
app.get('/getCommentsByAuthor', comment.getCommentsByAuthor);



//Delete API Routes
app.delete('/deleteComment', comment.deleteComment);
app.delete('/deleteListing', listing.deleteListing);

//Post routes used in web interface
app.post('/register', listing.register);
app.post('/view/addCommentWithoutKey', comment.addcommentwithoutkey);
app.post('/addUser', user.addUser);

//Post API Routes
app.post('/postListing', listing.addlisting);
app.post('/postComment', comment.addcomment);
app.post('/postCommentUser', comment.postCommentUser);


//Put routes used in web interface:
app.put('/edit/update', listing.update);

//Put routes used in API:
app.put('/putListing', listing.changelisting);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
//Error handlers:

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
