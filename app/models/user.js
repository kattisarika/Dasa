var mongoose = require('mongoose');

var bcrypt   = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({


  local:{
      email         : {type:String,default:''},
      password      : {type:String,default:''}
  },

  facebook:{

          id           : {type:String,default:''},
          token        : {type:String,default:''},
          email        : [
                  {type:String,default:''}
                  ],
          name         : {type:String,default:''}
  },  
     
     
google:{

          id           : {type:String,default:''},
          token        : {type:String,default:''},
          email        : [
                  {type:String,default:''}
                  ],
          name         : {type:String,default:''}
  }
   
    
},{timestamps:true});


userSchema.methods.generateHash = function(password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  userSchema.methods.validPassword = function(password){

    return bcrypt.compareSync(password,this.local.password);
  };


var user = module.exports = mongoose.model('user', userSchema);



