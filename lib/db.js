// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
//
//
// //exports
// module.exports.mongoose = mongoose;
// module.exports.Schema = Schema;
//
// //define credentials
// var username = "colleen";
// var password ="1234";
// var address = "@ds017165.mlab.com:17165/apiwhatever";
// connect();
//
// //connect function
// function connect() {
//
//   var url = "mongodb://" + username + ":" + password + address;
//   mongoose.connect(url);
// }
// //Disconnect
// function disconnect() {
// mongoose.disconnect
// }

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//exports
module.exports.mongoose = mongoose;
module,exports.Schema = Schema;

//define credentials
var username = "colleen";
var password ="1234";
var address = "@ds023674.mlab.com:23674/colleen";
connect();

//connect function
function connect() {

  var url = "mongodb://" + username + ":" + password + address;
  mongoose.connect(url);
}
//Disconnect
function disconnect() {
mongoose.disconnect
}
