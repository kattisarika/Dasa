var express = require('express');
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


var methodOverride = require('method-override');
var app = express();

var configDB = require('./config/database.js');
mongoose.connect(configDB.url)
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');
var morgan = require("morgan");
app.use(morgan('dev'));


app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressSession({secret:'anystringoftext',saveUninitialized:true,resave:true}))

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

require('./app/routes.js')(app);

/*app.get('/', function (req, res) {
 res.sendFile('index');
 console.log(req.cookies);
 console.log("========================")
 console.log(req.expressSession)
});*/

app.locals.pd1data=require('./pd1.json');

app.locals.gmusicdata=require('./generalmusiclist.json');

app.locals.instrumusicdata=require('./instru.json');


app.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));

/*app.post('/send-email', function (req, res) {
	console.log(req.body);
var smtpTransport = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          auth: {
              user: 'myreflections2018@gmail.com',
              pass: 'Yammer123$'
          }
      });	
      
var mailOptions = {

          
          to: 'myreflections2018@gmail.com', // list of receivers
          subject: "testing what works", // Subject line
          text: "asbxkjakada", // plain text body
         
      };
      
      smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
        res.end("error");
     }else{
          console.log("Message sent: " + response.message);
        response.end("sent");
         }
		});
      }); */
var port = process.env.PORT || 3000;


app.listen(port, function() {
    console.log("local host" + port);
});