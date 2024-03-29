var mongoose = require('mongoose');

var usertasksSchema = mongoose.Schema({
	email: {
        type: String,
        unique: true,
        required: true
         
    },
    task1:{
    	type: String,
        unique: false,
        required: true
    },
    task2:{
    	type: String,
        unique: false,
        required: true
    },task3:{
        type: String,
        unique: false,
        required: true
    },usermind:{
        type: String,
        unique: false,
        required: true
    },created: {
      type: Date,
      required: true,
      default: new Date()
   }

});

var usertasks = module.exports = mongoose.model('usertasks', usertasksSchema);


module.exports.createusertasks = function(addusertasks, callback) {
        // create user
        addusertasks.save(callback);
    }


module.exports.getUserTasksByUsername = function (username, callback) {
    var query = {
        username: username
    };
    UserTasks.findOne(query, callback);
}
