var express = require('express');
var http = require('http');
var https = require('https');

var fs = require('fs')
var path = require('path');
var nodemailer = require("nodemailer");

var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passport = require('passport');
var passportLocal = require('passport-local');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var passportLocal = require('passport-local');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var request = require('request');
var parser = require('xml2json');

var socket= require('socket.io');


var methodOverride = require('method-override');
//var configAuth= require('./app/models/auth');

var app = express();


var mongoose = require('mongoose');

User = require('./app/models/user');
UserDetails = require('./app/models/userdetails')
UserTasks = require('./app/models/usertasks')
var auth = require('./middlewares/authorization');

var privateKey  = fs.readFileSync('key.pem');
var certificate = fs.readFileSync('cert.pem');

var credentials = {key: privateKey, cert: certificate};

app.set('view engine', 'ejs');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
extended: true
}));


app.use(cookieParser());
app.use(expressSession({
secret: 'secret123',
resave: true,
saveUninitialized: true,
activeDuration: 5 * 60 * 1000
}));

// To do local authentication below lines are mandatory
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); 

app.use(methodOverride());
app.use(express.static(__dirname + '/public'));


mongoose.connect('mongodb://superadmin:superadmin@ds133291.mlab.com:33291/ikanofy');

//mongoose.connect('mongodb://superadmin:superadmin@ds123770.mlab.com:23770/ikanofydev');
var db = mongoose.connection;



app.locals.pd1data=require('./pd1.json');

app.locals.gmusicdata=require('./generalmusiclist.json');

app.locals.instrumusicdata=require('./instru.json');

app.locals.spbooksdata=require('./spbooks.json');

/*app.locals.englishsonglistdata= require('./englishsonglist.json');

app.locals.gujuratisonglistdata= require('./gujuratisonglist.json');

app.locals.hindisonglistdata = require('./hindisonglist.json');

app.locals.marathisonglistdata = require('./marathisonglist.json');

app.locals.bengalisonglistdata = require('./bengalisonglist.json');

app.locals.tamilsonglistdata = require('./tamilsonglist.json');

app.locals.malyalamsonglistdata = require('./malyalamsonglist.json');

app.locals.telugusonglistdata = require('./telugusonglist.json');*/
app.locals.angrydata = require('./angry.json');

app.locals.oldagequotesdata = require('./oldagequotes.json');

app.locals.oldagedepressionquotesdata = require('./oldagedepressionquotes.json');

app.locals.teenselfesteemdata = require('./teenselfesteem.json');

app.locals.teenselfesteemaffirmationsdata = require('./teenselfesteemaffirmations.json');

var LocalStrategy = require("passport-local").Strategy ;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var authConfig = require('./config/auth');


// serialize the object when user is being sent by strategies
	passport.serializeUser(function(user,done){
			
			done(null,user);
		
	});

	//deserailize function stores the entire user object in req.user
	// It sort of takes care of revisits of the user after logging in
	passport.deserializeUser(function(id,done){

		User.findById({"_id":id},function(err,user){
		
			done(null,user);
		
		})
	});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


passport.use(new FacebookStrategy({
    /*'clientID': '1643085615774552',
    'clientSecret': 'f3fbc7a2eeda5203977028f6b9dc76b2',
    'callbackURL': "https://localhost:8443/auth/facebook/callback",
    'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
    'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API*/

    'clientID': authConfig.facebookAuth.clientID,
    'clientSecret': authConfig.facebookAuth.clientSecret,
    'callbackURL': authConfig.facebookAuth.callbackURL,
    'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
    'profileFields' : ['id', 'email', 'name']

  },
  function(token, refreshToken, profile, done) {
   console.log(token);
       process.nextTick(function() {

	    	//Search for user with concerned profile-ID
	    	db.collection('users').findOne({"facebook.id":profile.id},function(err,user){

		    	if(err){

		    		return done(err);
		    	}

		    	else if(user){
		    		
		    		// If user present, then log them in
		    		return done(null,user);

		    	}

		    	else{
		    		
		    		// if the user isnt in our database, create a new user
                    var newUser          = new User();
                    
                    newUser.facebook.id    = profile.id;
                    newUser.facebook.token = token;
                    newUser.facebook.name  =  profile.name.givenName;
                    newUser.facebook.email =  profile.emails[0].value;

                              
                    newUser.save(function(err,finalResult) {
                        if (err){
                            throw err;
                        }

                        console.log('facebook');
                        console.log('finalResult');
                        console.log(newUser);
                        return done(null, newUser);
                    });
                }
		    	
		    })
	   	}); // process.nextTick e
	  
  }
));

passport.use(
    new GoogleStrategy({
        // options for google strategy
   'clientID': authConfig.googleAuth.clientID,
    'clientSecret': authConfig.googleAuth.clientSecret,
    'callbackURL': authConfig.googleAuth.callbackURL
    }, (token, refreshToken, profile, done) => {
        // passport callback function
         console.log(token);
       process.nextTick(function() {

	    	//Search for user with concerned profile-ID
	    	db.collection('users').findOne({"google.id":profile.id},function(err,user){

		    	if(err){

		    		return done(err);
		    	}

		    	else if(user){
		    		
		    		// If user present, then log them in
		    		return done(null,user);

		    	}

		    	else{
		    		
		    		// if the user isnt in our database, create a new user
                    var newUser          = new User();
                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;

                    for(var i in profile.emails){

                    	newUser.google.email[i] = profile.emails[i].value;
                    	if(profile.emails.length>1){
                    		newUser.email.split(',');
                    	}
                    }
                              
                    newUser.save(function(err,finalResult) {
                        if (err){
                            throw err;
                        }

                        console.log('google');
                        console.log('finalResult');
                        console.log(newUser);
                        return done(null, newUser);
                    });
                }
		    	
		    })
	   	}); // process.nextTick e
	   

    })
);


passport.use('local-signup',new LocalStrategy({
	    usernameField: 'username',
	    passwordField: 'password',
	    passReqToCallback:true
	  },
	  function(req,username, password, done){
	  	console.log(username);
	  	console.log(password);
	  	 process.nextTick(function() {
	    

			    User.findOne({"local.email":username},function(err,user){

			    	if(err){

			    		return done(err);
			    	}

			    	else if(user){

			    		console.log("NULL");
			    		return done(null,false,req.flash("signupMessage","E-Mail already Taken"));
			    	}

			    	else{
			    		      
		                 	var newUser = new User();
		    
			                  
			                    newUser.local.email = req.body.username;
			                    newUser.local.password = newUser.generateHash(req.body.password);                	

		                	newUser.save(function(err,result){
		                		if(err){
		                			return done(err);
		                		}
		                		else{
		                			
		                			// Returns user and jumbs back to the route
		                			console.log(newUser.local);
		                			console.log("jjashf");
		                			return done(null,newUser);
		                		}
		                	})
					}
			    	
			    })
	   })

	}));



passport.use('local-login',new LocalStrategy({
	    usernameField: 'username',
	    passwordField: 'password',
	    passReqToCallback:true
	  },
	  function(req,username, password, done){
	    console.log(username);
	  	console.log(password);

	    	//Dont search by password field also, since we have not hashed it yet.
		    User.findOne({"local.email":username},function(err,user){

		    	if(err){

		    		return done(err);
		    	}

		    	else if(!user){
		    		
		    		// Returns message and jumps back to the route
		    		return done(null,false,req.flash("loginMessage","Invalid credentials"));

		    	}

		    	else if(!user.validPassword(password)){

		    		return done(null,false,req.flash("loginMessage","Password is wrong!"));

		    	}

		    	else{
		    		
		    		return done(null,user);
		    	}
		    })
	   }))


//StackOverflow-IDEA to not CACHE
app.use(function (req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});




app.get("/", function (req, res) {
res.render('index');
});

/*app.get('/sign', function (req, res) {
res.render('sign.ejs');
});*/


 app.post('/', passport.authenticate('local-signup', {
        successRedirect: '/login',
        failureRedirect: '/',
        failureFlash: true
    }));



app.get('/login', function (req, res) {
console.log("In /login", req.isAuthenticated());
console.log("In /login", req.body);
res.render('login.ejs');

});



// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook', {scope:'email'}));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/mywelcomepage',
                                      failureRedirect: '/login' }));

//app.get('/auth/google', passport.authenticate('google', {
//    scope: ['profile']
//}));

app.get('/auth/google/', passport.authenticate('google', {
	 scope : ['profile', 'email'] 
	}
	));

 app.get('/auth/google/callback',passport.authenticate('google', {

                    failureRedirect : 'http://localhost:3000/login'
            }),function(req,res){

    	console.log(req);

    var username1= req.user.google.email;

	console.log("In POST GOOGLE LOGIN /login", username1);
	res.redirect("/mywelcomepage");
});





app.get('/sign', function (req, res) {
res.render('sign.ejs');
});


 app.post('/sign', passport.authenticate('local-signup', {
        successRedirect: '/login',
        failureRedirect: '/sign',
        failureFlash: true
    }));





app.post('/login', passport.authenticate('local-login', {
failureRedirect: '/login'
}), function (req, res) {

console.log("In POST LOGIN /login", req.isAuthenticated());
//console.log("In  POST LOGIN /login", req.body);
retStatus = 'Success';
var username1="";
console.log(req.user);
username1= req.user.local.email;
console.log("In POST LOGIN /login", username1);
res.redirect("mywelcomepage");
});



app.get('/forgotpassword',function(req,res){
res.render('forgotpassword.ejs',{
data : ""
});
});

app.post('/forgotpassword',function(req,res){
console.log("Am I coming in Forgot Password!");
//console.log(req);

var username= req.body.username;
var password = req.body.updatepassword;
var confpassword = req.body.confpassword;
if(password !== confpassword){
res.render('forgotpassword.ejs',{
data : "Passwords dont match"
});
}else {



bcrypt.hash(req.body.updatepassword, 10, function (err, hash) {
if (err) throw err;
// set hashed pwd
password = hash;
// create user
console.log("------------");
console.log(password);

db.collection('users').findOne({email: username}, function(err,obj) {   
console.log(obj); 
if(err || (obj === null)){
res.render('forgotpassword.ejs',{
data : "Email does not exist"
});
}else{
console.log(obj); 
db.collection('users').findAndModify(
{email: username}, // query
[['_id','asc']],
{$set: {password: password}},
{}, 
// replacement, replaces only the field "hi"

function(err, user) {
if (err){
console.warn(err.message); 
// returns error if no matching object found
res.render('forgotpassword.ejs',{
data : "Something went wrong, try again"
});
}else{
console.log("--------------");
console.log(user.value.username);
console.log("--------------");
console.log(user.email);
res.render('passwordresetsuccess.ejs');
}
})
}
});
});
}

});

app.get('/forgotpassword',function(req, res){
res.render('forgotpassword.ejs',{
data:"User does not exist"
});
});




app.get('/mywelcomepage',auth.checkLogin,function(req, res){
	//res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate,
     //         max-stale=0, post-check=0, pre-check=0');
var username="";
if(req.user.google.email !='' || req.user.google.email != null)
  username= req.user.google.email;
if(req.user.facebook.email !='' || req.user.facebook.email != null)
  username= req.user.google.email;
if(req.user.local.email !='' || req.user.local.email != null)
  username= req.user.google.email;

res.render('mywelcomepage',{
  isAuthenticated:req.isAuthenticated(),
  user:req.user
});

});


app.get('/selfhelp',auth.checkLogin,function(req,res){

	res.render('selfhelp',{
		  isAuthenticated:req.isAuthenticated(),
		  user:req.user
		});
});






app.get('/guidedtours',auth.checkLogin,function(req, res){
res.render('guidedtours.ejs', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});
});

app.get('/dailyplanner',auth.checkLogin,function(req, res){
res.render('dailyplanner.ejs', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});
});

app.get('/dashboard',auth.checkLogin,function(req, res){
res.render('dashboard.ejs', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});
});

app.get('/spiritualtalks',auth.checkLogin,function(req, res){
res.render('spiritualtalks.ejs', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});
});

app.get('/smarttricks',auth.checkLogin,function(req,res){
res.render('smarttricks.ejs', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});


});


app.post('/userdetails',auth.checkLogin,function(req, res){
console.log("----------------Am I in the Users Details Post---------");

console.log("----------------kooooooooo---------");
//console.log(req);
var username1=req.body.username;
username1=username1.trim();
console.log("Yummy"+ username1);
//	console.log("In POST GOOGLE LOGIN /login", username1);
//db.collection('userdetails').find({email:username1}, function(err, data)  {   
UserDetails.find({"email":username1},function(err,data) {
	if (err) throw err;
	
	console.log(data);
	console.log(data.length);
if(data.length !== 0 &&  data !== undefined){

	
	console.log('Username exists.');
	var agegroup = req.body.ageradio;
	var purpose= req.body.selectGoal;
	var email = req.body.username;
	email = email.trim();


	console.log(agegroup);
	console.log(purpose);
	console.log(email.trim());

	db.collection('userdetails').update(
		{email: email}, 
		{$set: {
			agegroup: agegroup,
			purpose: purpose
		   }
		},
		function(err, userresult) {
			if (err){
			console.warn(err.message); 
		}
		console.log('Am i coming here 2, existing user');
		//console.log(userresult);
		switch(agegroup && purpose){
					case ('teens' && 'Just exploring'): 
					res.redirect('thanks');
					break; 

					case ('teens' && 'Improve my life'): 
					res.redirect('thanks');
					break;      

					case ('teens' && 'Improve my self esteem'): 
					res.redirect('teenselfesteemthanks');
					break; 

					case ('teens' && 'Improve my grades'): 
					res.redirect('teengradesthanks');
					break; 

					case ('teens' && 'Be rich and powerful'): 
					res.redirect('teenrichpowerfulthanks');
					break; 

					case ('teens' &&  'Anxious or Depressed'): 
					res.redirect('teenanxiousthanks');
					break; 

					

					case ('thirty' && 'Just exploring'): 
					res.redirect('thanks');
					break;  

					case ('thirty' && 'Improve my life'): 
					res.redirect('thanks');
					break;  

					case ('thirty' && 'Stuck mid way in career and looking inward'): 
					res.redirect('thanks');
					break;   

					case ('thirty' && 'Improve my self esteem'): 
					res.redirect('thirtyselfesteemthanks');
					break; 


					case ('thirty' && 'Become rich and powerful'): 
					res.redirect('thirtyrichpowerfulthanks');
					break; 

					case ('thirty' &&  'Better manage time'): 
					res.redirect('teenanxiousthanks');
					break;   

					case ('thirty' && 'Manage my finances'): 
					res.redirect('thirtymanagemyfinances');
					break; 

					case ('thirty' && 'Anxious or Depressed'): 
					res.redirect('thirtyanxiousthanks');
					break;     


					case ('midforty' && 'Just exploring'): 
					res.redirect('thanks');
					break; 

					case ('midforty' && 'Improve my life'):
					res.redirect('thanks');
					break;  

					case ('midforty' && 'Improve my self esteem'): 
					res.redirect('thanks');
					break;

					case('midforty' &&  'Stuck mid way in career and looking inward'):
					res.redirect('thanks');
					break;

					case ('midforty' && 'I want to become rich and powerful'): 
					res.redirect('thanks');
					break; 

					case ('midforty' && 'I want to manage my finances'): 
					res.redirect('thanks');
					break; 

					case ('midforty' && 'I want to better manage time'): 
					res.redirect('thanks');
					break; 

					case ('midforty' &&  'Anxious or Depressed'): 
					res.redirect('thanks');
					break;     

					case ('oldage' && 'Just exploring'): 
					res.redirect('oldagethanks');
					break; 

					case ('oldage' &&  'Anxiety or Depression'): 
					res.redirect('oldagedepressedthanks');
					break;  

					default:
					res.redirect('thanks');
					break;         

					}

	});

	
	
    
  } else {

		var agegroup = req.body.ageradio;
		var purpose= req.body.selectGoal;
		var email = username1;

		


		var uDetails = new UserDetails({
		email: email,
		agegroup: req.body.ageradio,
		purpose: req.body.selectGoal,  
		created :Date.now()
		});
		console.log("All data captured in backend" + uDetails.agegroup + "," + uDetails.purpose + "," + uDetails.email + Date.now());

		UserDetails.createuserdetails(uDetails, function (err, user) {
		if (err) throw err;
		console.log("______________ Inside User Details")
		console.log(user);

		db.collection('userdetails').findOne({email:  email}, function(err,data) {   
			if (err) throw err;
			
			console.log('Am i coming here 1, existing user');
			console.log(data.agegroup);
			console.log(data.purpose);



			switch(data.agegroup && data.purpose){
					case ('teens' && 'Just exploring'): 
					res.redirect('thanks');
					break;   
					case ('teens' && 'Improve my life'): 
					res.redirect('thanks');
					break;        
					case ('teens' && 'Improve my self esteem'): 
					res.redirect('teenselfesteemthanks');
					break; 
					case ('teens' && 'Improve my grades'): 
					res.redirect('teengradesthanks');
					break; 
					case ('teens' && 'Be rich and powerful'): 
					res.redirect('teenrichpowerfulthanks');
					break; 
					case ('teens' &&  'Anxious or Depressed'): 
					res.redirect('teenanxiousthanks');
					break;  
					


					case ('thirty' && 'Just exploring'): 
					res.redirect('thanks');
					break;  
					case ('thirty' && 'Improve my life'): 
					res.redirect('thanks');
					break;  
					case ('thirty' && 'Stuck mid way in career and looking inward'): 
					res.redirect('thanks');
					break;       
					case ('thirty' && 'Improve my self esteem'): 
					res.redirect('thirtyselfesteemthanks');
					break; 

					case ('thirty' && 'Become rich and powerful'): 
					res.redirect('thirtyrichpowerfulthanks');
					break; 
					case ('thirty' &&  'Better manage time'): 
					res.redirect('teenanxiousthanks');
					break;   
					case ('thirty' && 'Manage my finances'): 
					res.redirect('thirtymanagemyfinances');
					break; 
					case ('thirty' && 'Anxious or Depressed'): 
					res.redirect('thirtyanxiousthanks');
					break;     


					case ('midforty' && 'Just exploring'): 
					res.redirect('thanks');
					break; 
					case ('midforty' && 'Improve my life'):
					res.redirect('thanks');
					break;        
					case ('midforty' && 'Improve my self esteem'): 
					res.redirect('thanks');
					break;
					case('midforty' &&  'Stuck mid way in career and looking inward'):
					res.redirect('thanks');
					break;
					case ('midforty' && 'I want to become rich and powerful'): 
					res.redirect('thanks');
					break; 
					case ('midforty' && 'I want to manage my finances'): 
					res.redirect('thanks');
					break; 
					case ('midforty' && 'I want to better manage time'): 
					res.redirect('thanks');
					break; 
					case ('midforty' &&  'Anxious or Depressed'): 
					res.redirect('thanks');
					break;     

					case ('oldage' && 'Just exploring'): 
					res.redirect('oldagethanks');
					break;  

					case ('oldage' &&  'Anxiety or Depression'): 
					res.redirect('oldagedepressedthanks');
					break; 

					default:
					res.redirect('thanks');
					break;         

					}

				});


			});
		}
	});

});

app.get('/thanks',function(req,res){
res.render('thanks', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});
});


app.get('/oldagethanks',function(req,res){
res.render('oldagethanks', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});
});




app.get('/oldagedepressedthanks',function(req,res){
res.render('oldagedepressedthanks', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});
});   


app.get('/teengradesthanks',function(req,res){
res.render('teengradesthanks', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});
});   

app.get('/thirtyrichpowerfulthanks',function(req,res){
res.render('thirtyrichpowerfulthanks', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});
});  


app.get('/teenrichpowerfulthanks',auth.checkLogin,function(req,res){
res.render('teenrichpowerfulthanks', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});
});  

app.get('/teenanxiousthanks',function(req,res){
res.render('teenanxiousthanks', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});
});  

app.get('/teenselfesteemthanks',function(req,res){
	  res.render('teenselfesteemthanks', {
	 isAuthenticated: req.isAuthenticated(),
	 user: req.user
	});
});      





app.post('/teenselfesteemthanks/tasklist',function(req,res){

console.log(req.body.task1);
console.log(req.body.task2);
console.log(req.body.task3);
console.log(req.body.usermind);
console.log(req.body.user);

var userTaskList = new UserTasks({
// username: req.body.name,
// email: req.body.email,
username: req.body.user,
task1: req.body.task1,
task2: req.body.task2,
task3: req.body.task3,
usermind: req.body.usermind,
created :Date.now()
//wishlistimage:req.body.wishlistimage,


});

UserTasks.createusertasks(userTaskList, function (err) {
if (err) throw err;
console.log('User tasks created!');

retStatus = 'Success';

res.redirect('teenselfesteemthanks');
// var value=res.json(results);
// res.redirect('/team');
/*res.send({
retStatus: retStatus,
redirectTo: '/teenselfesteemthanks',
msg: 'Just go there please' // this should help
});

});*/

});

});


app.put('/teenselfesteemthanks/tasklist:id', isLoggedIn, function (req, res) {

UserTasks.findByIdAndUpdate({'_id': req.params.id},{
task1: req.body.task1,
task2: req.body.task2,
task3: req.body.task3,
usermind: req.body.usermind,
created :Date.now()
}, function (err, result) {
if (err) {
console.log(err.toString());
} else {
// handle document
retStatus = 'Success';
res.redirect('teenselfesteemthanks');
}
});


});

app.get('/teenspiritualtalk', auth.checkLogin, function (req, res) {
res.render('teenspiritualtalk', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});

});

app.get('/teenspiritualbook', auth.checkLogin, function(req,res){
res.render('teenspiritualbook', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});
});


app.get('/yourtday', auth.checkLogin, function (req, res) {
res.render('yourtday', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});

});

app.get('/connect2counsellors',auth.checkLogin,function(req,res){
res.render('connect2counsellors', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});
});


app.get('/tests',auth.checkLogin,function(req,res){
	res.render('tests', {
	isAuthenticated: req.isAuthenticated(),
	user: req.user
	});
});

app.get('/lifeskills',auth.checkLogin,function(req,res){
	res.render('lifeskills', {
	isAuthenticated: req.isAuthenticated(),
	user: req.user
	});
});

app.get('/fitness',auth.checkLogin,function(req,res){
	res.render('fitness', {
	isAuthenticated: req.isAuthenticated(),
	user: req.user
	});
});

app.get('/connect2careercoaches',auth.checkLogin,function(req,res){

	db.collection('careercoaches').find().toArray(function(err, data) { 
		if(err) throw error;
		console.log(data);
		if(data.length < 1 || data == undefined){
		res.render('connect2careercoaches', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user,
		message: "No data available for that zipcode"

		});

		}else {
		res.render('connect2careercoaches', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user,
		results: data

		});
		}

  });
});

app.post('/connect2careercoaches',isLoggedIn,function(req,res){

var searchdata=req.body.inputsearch;
console.log(searchdata);
var query = { zipcode: req.body.inputsearch };
db.collection('careercoaches').find(query).toArray(function(err, data) { 
if(err) throw error;
console.log(data);
if(data.length < 1 || data == undefined){
res.render('connect2careercoaches', {
isAuthenticated: req.isAuthenticated(),
user: req.user,
message: "No data available for that zipcode"

});

}else {
res.render('connect2careercoaches', {
isAuthenticated: req.isAuthenticated(),
user: req.user,
results: data

});
}

});



});

app.get('/connect2therapist',function(req,res){
res.render('connect2therapist',{
isAuthenticated: req.isAuthenticated(),
user: req.user
});
});


app.post('/connect2therapist',isLoggedIn,function(req,res){

var searchdata=req.body.inputsearch;
console.log(searchdata);
var query = { zipcode: req.body.inputsearch };
db.collection('careercoaches').find(query).toArray(function(err, data) { 
if(err) throw error;
console.log(data);
if(data.length < 1 || data == undefined){
res.render('connect2therapist', {
isAuthenticated: req.isAuthenticated(),
user: req.user,
message: "No data available for that zipcode"

});

}else {
res.render('connect2therapist', {
isAuthenticated: req.isAuthenticated(),
user: req.user,
results: data

});
}

});



});

app.get('/dailyroutine',function(req,res){
res.render('dailyroutine', {
isAuthenticated: req.isAuthenticated(),
user: req.user

});     

});

app.get('/dailyevents',function(req, res){
res.render('dailyevents', {
isAuthenticated: req.isAuthenticated(),
data:"",
data1:"",
data2:"",
data3:"",
data4:"",
data5:"",
user: req.user
});
});

app.post('/userdayevents',function(req,res){

var daygoal= req.body.selecttodaysGoal;
console.log("_____________________________");
console.log(daygoal);

if(daygoal =="I am happy"){
res.render('dailyevents', {
isAuthenticated: req.isAuthenticated(),
data : "Glad you are happy, be happy and stay happy!",
data1:"",
data2:"",
data3:"",
data4:"",
data5:"",
user: req.user
});
}else if(daygoal =="I am very angry and upset"){

res.render('dailyevents', {
isAuthenticated: req.isAuthenticated(),
data : "You are fine, your mind is tricking you!! your mind running into a spiral and repeating the same thing again and again",
data1:"Just put those thoughts in a trash bin and lets read some good movie review",
data2: "Did you go for your exercise today? , Did you take time and read your affirmations",
data3: "If you have not done them, please do it now",
data4: "Does being angry , solve your problem?  If the answer is No , then stop being angry",
data5: "Then lets  play some nice music or drink a glass of cold water and cool down.",
user: req.user
});
} else if(daygoal =="I feel anxious"){

res.render('dailyevents', {
isAuthenticated: req.isAuthenticated(),
data : "Ok, lets scream,I am not going to be anxious 5 times in your mind",
data1:"Just put those thoughts in a trash bin and lets ask anxiety to catch some fishes in a dry lake!",
data2: "Did you go for your exercise today? , Did you take time and read your affirmations",
data3: "If you have not done them, please do it now",
data4: "Watch the videos in my spiritual talk section on how to be less anxious",
data5: "Then lets  play some nice music or drink a glass of cold water and cool down.",
user: req.user
});
}else if(daygoal =="I dislike my friends as they are mean"){

res.render('dailyevents', {
isAuthenticated: req.isAuthenticated(),
data : "Hey! First of all Congratulations to you!",
data1:"You have someone to dislike, you have someone whom your mind thinks they are mean",
data2: "My friends in the neighborhood have no friends, as no one talks to them",
data3: "Now pray the universe and tell out loud, I would love my friends to love me",
data4: "Oh! Lord of the universe, let my friends love me and let me talk and act and behave nicely with them",
data5: "I cannot force them to like me, but can wait long enough and courageously and keep doing my work sincerely till they come back to me",
user: req.user
});
}else if(daygoal =="I dislike the food I am eating"){

res.render('dailyevents', {
isAuthenticated: req.isAuthenticated(),
data : "Hey! First of all Congratulations to you!",
data1:"You have some food to eat",
data2: "Did you look at the homeless guy who had nothing to eat and was eyeing on your food",
data3: "Now pray the universe and tell out loud, I will not complain and rather enjoy the little lunch I get from home or buy outside",
data4: "Oh! Lord of the universe, let me thank God that I have food to eat and thats what matters",
data5: "I cannot force myself to eat this food so I choose to go hungry",
user: req.user
});
}else if(daygoal =="I dont have anyone to talk to"){

res.render('dailyevents', {
isAuthenticated: req.isAuthenticated(),
data : "Hey! First of all Congratulations to you!",
data1:"You have me to talk to, May be you need to clean your room today",
data2: "Do you have a hobby? like reading, watching TV, listening to music,  drawing , painting, , whatever whatever",
data3: "Did you go for your exercise? Can you  scream , shout, shake your head , turn backwards and forwards",
data4: "Do all that , then see yourself getting charged up to work on some hobby you like",
data5: "Otherwise you can talk to me, I will listen to your tales ",
user: req.user
});
}else if(daygoal =="I am bored"){

res.render('dailyevents', {
isAuthenticated: req.isAuthenticated(),
data : "Hey! First of all Congratulations to you!",
data1:"You have me to talk to, May be you need to clean your room today",
data2: "Do you have a hobby? like reading, watching TV, listening to music,  drawing , painting, , whatever whatever",
data3: "Did you go for your exercise? Can you  scream , shout, shake your head , turn backwards and forwards",
data4: "Do all that , then see yourself getting charged up to work on some hobby you like",
data5: "Otherwise you can talk to me, I will listen to your tales ",
user: req.user
});
}else if(daygoal =="I am nervous as I dont have a boyfriend"){

res.render('dailyevents', {
isAuthenticated: req.isAuthenticated(),
data : "Hey! First of all Congratulations to you, you can groom yourself and wait for the best guy to hold your hand!",
data1:"You are a very nice person, very warm and caring and I am sure you will find someone soon",
data2: "Drink 10 glasses of water a day",
data3: "Don't forget your walks atleast 1 hour a day, suppose 5 miles ",
data4: "Read the latest novels, talk about them, go to the parlor and get a nice haircut , put on a facemask",
data5: "Relax and enjoy the time you have now, when you get a boyfriend, your freedom is lost!",
user: req.user
});
}else if(daygoal =="I dont feel loved"){

res.render('dailyevents', {
isAuthenticated: req.isAuthenticated(),
data : "Hey! First of all you are not alone, even I want compassion!",
data1:"So many users keep using me, and I keep going to the server to fetch the results that I dont feel loved ",
data2: "Bright side! I love myself, I dont care if others love me",
data3: "I dont care if others appreciate what I do to help them, but I feel happy and satisfied when I do it, so I go for it ",
data4: "You are lucky as you can vent out to me, some people have no one, not even me! ",
data5: "When you truly love, that gives inner strength and satisfaction, so dont stop loving people",
user: req.user
});
}else if(daygoal =="It was very normal"){

res.render('dailyevents', {
isAuthenticated: req.isAuthenticated(),
data : "Normal is good , keep going!",
data1:"Say those affirmations, dont forget ",
data2: "Drink 8-10 glasses of water, dont forget",
data3: "Go for your exercise",
data4: "You are lucky as you can vent out to me, some people have no one, not even me! ",
data5: "",
user: req.user
});
}else if(daygoal =="I dont have enough money"){

res.render('dailyevents', {
isAuthenticated: req.isAuthenticated(),
data : "Save every single money you get",
data1:"Live within your means, Be debt free ",
data2: "Money is never enough , the only money you save will save your rainy days",
data3: "Go for your exercise",
data4: "You are lucky as you can vent out to me, some people have no one, not even me! ",
data5: "",
user: req.user
});
}else if(daygoal =="I lost my job"){

res.render('dailyevents', {
isAuthenticated: req.isAuthenticated(),
data : "Hope you have saved your job",
data1:"Live within your means, Be debt free ",
data2: "Money is never enough , the only money you save will save your rainy days",
data3: "Go for your exercise",
data4: "Keep applying for jobs till you find one, ask help, there is nothing wrong in asking for help",
data5: "Congratulations! Today may be the day you would find your new job, be hopeful and read your affirmations",
user: req.user
});
}else{
res.render('dailyevents', {
isAuthenticated: req.isAuthenticated(),
data : "Follow me on, lets do something fun together",
data1:"",
data2:"",
data3:"",
data4:"",
data5:"",
user: req.user
});   
}


});


app.get('/logout',function(req,res){


 req.session.destroy(function (err) {
    
        req.logout();
        req.user = null;
        res.redirect('/');
    });

});


app.get('/spiritualbooks',function(req, res){
res.render('spiritualbooks', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});
});



app.get('/contact',function(req, res){
res.render("contact.ejs")
});


app.get('/pd1',function(req, res){
res.render("pd1.ejs")
});

app.get('/spiritualgurus',function(req, res){
res.render("spiritualgurus.ejs")
});

app.get('/randomlist',function(req,res){
res.render('songlist-working.ejs', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});
});       

app.post('/devlanguagedetails', function(req,res){

var language = req.body.selectlanguage;
console.log("Language is ----" , language);
if(language == "Kannada"){
res.render('songlist-working.ejs', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});
}else if(language == "English"){
res.render('englishsonglist.ejs', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});

}else if(language == "Hindi"){
res.render('hindisonglist.ejs', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});
}else if(language == "Tamil"){
res.render('tamilsonglist.ejs', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});
}else if(language == "Telugu"){
res.render('telugusonglist.ejs', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});
}else if(language == "Marathi"){
res.render('marathisonglist.ejs', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});
}else if(language == "Malyalam"){
res.render('malyalamsonglist.ejs', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});
}else if(language == "Gujurati"){
res.render('gujuratisonglist.ejs', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});
}else if(language == "Bengali"){
res.render('bengalisonglist.ejs', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});
}else {

}        
});   




/* app.get('/createmyplaylist',function(req,res){
res.render('createmyplaylist.ejs', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});

});*/


/*app.get('/englishsonglist', function(req,res){
res.render('englishsonglist.ejs', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});
});  */  


app.get('/medimusic',function(req,res){
res.render('medimusic.ejs', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});

});


app.get('/instrumusic',function(req,res){
res.render('instrumusic.ejs', {
isAuthenticated: req.isAuthenticated(),
user: req.user
});

});

app.get('/yoursong', function(req,res){
res.render("yoursong.ejs");
});

app.get('/aboutus', function(req,res){
res.render("aboutus.ejs");
});

app.get('/songs',function(req,res){
res.render("songlist-working.ejs");
});

// route middleware to make sure
function isLoggedIn(req, res, next) {

// if user is authenticated in the session, carry on
if (req.isAuthenticated())
return next();

// if they aren't redirect them to the home page
res.redirect('/');
}




var httpsServer = https.createServer(credentials, app);


httpsServer.listen(8443);





//var port = process.env.PORT || 3000;
var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
console.log("local host" + port);
});

var io = socket(server);

io.on('connection',function(socket){
	console.log("made socket connection", socket.id);

	// Handle chat event
    socket.on('chat', function(data){
        // console.log(data);
        io.sockets.emit('chat', data);
    });

    // Handle typing event
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });
	
});
