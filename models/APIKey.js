var db = require('../lib/db');

//Create Schema
var apiKeySchema = db.Schema({
  key: {type: String, unique: true}
});


//Assign User Object
var myKey= db.mongoose.model('APIKey', apiKeySchema);

//exports
module.exports = myKey
