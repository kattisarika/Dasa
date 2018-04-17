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
//var configAuth= require('./app/models/auth');

var app = express();

var mongoose = require('mongoose');

User = require('./app/models/user');

app.use(methodOverride());
app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://superadmin:superadmin@ds015902.mlab.com:15902/ikanofy');

var db = mongoose.connection;

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
app.locals.pd1data=require('./pd1.json');

app.locals.gmusicdata=require('./generalmusiclist.json');

app.locals.instrumusicdata=require('./instru.json');



passport.use(new passportLocal.Strategy(function (username, password, done) {
    console.log("In passport", username);
    console.log("In passport", password);

    User.getUserByUsername(username, function (err, username) {
        console.log(username);
        if (err) throw err;
        if (!username) {
            console.log('Unknown user');
            return done(null, false, {
                message: 'Unknown user'
            });
        } else {
            console.log(username);
            var hash = username.password;
            console.log(hash);
            if (bcrypt.compareSync(password, hash)) {

                console.log("Autehntication passed");

                return done(null, {
                    id: username._id,
                    username: username.username
                    
                });

            } else {
                console.log('Invalid password');
                return done(null, false, {
                    message: 'Invalid password'
                });
            }

        }
    });

}));

app.get("/", function (req, res) {
    console.log("In /", req.body.email);
    console.log("IS In Index", req.isAuthenticated());
    //if(req.isAuthenticated())
    //  console.log(req.user.username);
    //console.log("Request object is " , req.body );
    if (req.isAuthenticated()) {
        res.render('index', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user.username


        });
    } else {
        res.render('index', {
            isAuthenticated: false,
            user: "no data"
        });
    }

});

app.get('/sign', function (req, res) {
  res.render('sign.ejs');
});



app.post('/sign', function (req, res) {
    console.log("In post /sign", req.body);

    if (req.body.name &&
        req.body.email &&
        req.body.password &&
        req.body.confpassword)



        if (req.body.password !== req.body.confpassword) {
            var err = new Error("passwords do not match");
            err.status = 400;
            res.send(err);
        } else {

            var newUser = new User({
                username: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            console.log("All data captured in backend" + newUser.username + "," + newUser.email + "," + newUser.password);

            User.createUser(newUser, function (err, user) {
                if (err) throw err;
                res.redirect('login');

            });

        }

});


app.get('/login', function (req, res) {
    console.log("In /login", req.isAuthenticated());
    console.log("In /login", req.body);
    res.render('login', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user
    });

});

/*passport.authenticate('local', { failureRedirect: '/login' }),*/
app.post('/login', passport.authenticate('local', {
    failureRedirect: '/blah'
}), function (req, res) {
     console.log(req);
    console.log("In POST LOGIN /login", req.isAuthenticated());
    //console.log("In  POST LOGIN /login", req.body);
    retStatus = 'Success';
    res.redirect("mywelcomepage");
});

app.get('/mywelcomepage',function(req, res){
        res.render('mywelcomepage', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user
    });
});

app.get('/index',function(req, res){
        res.render('index', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user
    });
});


app.get('/mysonglist',function(req, res){
        res.render('songlist.ejs', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user
    });
});

app.get('/guidedtours',function(req, res){
        res.render('guidedtours.ejs', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user
    });
});

app.get('/dailyplanner',function(req, res){
        res.render('dailyplanner.ejs', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user
        });
  });

app.get('/dashboard',function(req, res){
        res.render('dashboard.ejs', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user
    });
  });


app.get('/logout',function(req,res){

    req.logout();
  res.redirect('/');
   

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
        res.render("songlist-working.ejs")
    });

    app.get('/medimusic',function(req,res){
        res.render("medimusic.ejs")
    });


    app.get('/instrumusic',function(req,res){
        res.render("instrumusic.ejs")
    });

    app.get('/yoursong', function(req,res){
        res.render("yoursong.ejs");
    });

    app.get('/aboutus', function(req,res){
        res.render("aboutus.ejs");
    });

    app.get('/songs',function(req,res){
        res.render("songlist.ejs");
    });

passport.serializeUser(function (username, done) {
    console.log(username);
    done(null, username.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, username) {

        done(err, username);
    });
});


var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("local host" + port);
});
