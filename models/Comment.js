var db = require('../lib/db');
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

//Create Schema

var commentSchema = db.Schema({
  words: String,
  listing_name: String,
  listing_id: ObjectId,
  author: { type: String, default: 'anon' },
  time : { type : Date, default: Date.now }
});


//Assign User Object
var myComment = db.mongoose.model('Comment', commentSchema);

//exports
module.exports = myComment;
