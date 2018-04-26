var mongoose = require('mongoose');

var userdailyplannerSchema = mongoose.Schema({
	username: {
        type: String,
        unique: true,
        required: true
    },
    time:{
    	type: String,
        unique: false,
        required: true
    },
    activity:{
    	type: String,
        unique: false,
        required: true
    },created: {

      type: Date,
      required: true,
      default: new Date()

   }

});

var userdailyplanner = module.exports = mongoose.model('userdailyplanner', userdailyplannerSchema);


module.exports.createuserdailyplanner = function(adduserdailyplanner, callback) {
        // create user
        adduserdailyplanner.save(callback);
    }


module.exports.getUserDailyPlannerByUsername = function (username, callback) {
    var query = {
        username: username
    };
    UserDailyPlanner.findOne(query, callback);
}
