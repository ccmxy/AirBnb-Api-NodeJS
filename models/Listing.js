var db = require('../lib/db');
var Comment = require('./Comment.js');
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

//Create Schema
var locationSchema = db.Schema({
  city: String,
  state: String,
  _id:false
});
var commentSchema = db.Schema({
  words: String,
  listing_name: String,
  listing_id: ObjectId,
  author: { type: String, default: 'anon' },
  time : { type : Date, default: Date.now }
});
var listingSchema = db.Schema({
  location: locationSchema,
  comments: [commentSchema],
  name: {type: String, unique: true, required: true},
  noGuests: {type: Number, unique: false},
  price: {type: Number},
  author: {type: String, default: 'anon'}
});

//Notice that I tell it to delete the listing_ids
//on the listing's comments before the listing is removed,
//that's why i have to send in the name instead of id to remove
//the comments off of a listing. But I could use this to grey
//out comments from a user who didn't want their comments removed
//just because the listing was removed, and they would just be archived. 
listingSchema.pre('remove', function(next) {
    Comment.remove({listing_id: this._id}).exec();
    next();
});


//Assign User Object
var myListing = db.mongoose.model('Listing', listingSchema);

//exports
module.exports = myListing;
