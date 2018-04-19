var mongoose = require('mongoose');

var userdetailsSchema = mongoose.Schema({
	username: {
        type: String,
        unique: true,
        required: true
    },
    agegroup:{
    	type: String,
        unique: false,
        required: true
    },
    purpose:{
    	type: String,
        unique: false,
        required: true
    },created: {

      type: Date,
      required: true,
      default: new Date()

   }

});

var userdetails = module.exports = mongoose.model('userdetails', userdetailsSchema);


module.exports.createuserdetails = function(adduserdetails, callback) {
        // create user
        adduserdetails.save(callback);
    }


module.exports.getUserDetailsByUsername = function (username, callback) {
    var query = {
        username: username
    };
    UserDetails.findOne(query, callback);
}
