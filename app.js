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
UserDetails = require('./app/models/userdetails')

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

app.locals.spbooksdata=require('./spbooks.json');

app.locals.englishsonglistdata= require('./englishsonglist.json');

app.locals.gujuratisonglistdata= require('./gujuratisonglist.json');

app.locals.hindisonglistdata = require('./hindisonglist.json');

app.locals.marathisonglistdata = require('./marathisonglist.json');

app.locals.bengalisonglistdata = require('./bengalisonglist.json');

app.locals.tamilsonglistdata = require('./tamilsonglist.json');

app.locals.malyalamsonglistdata = require('./malyalamsonglist.json');

app.locals.telugusonglistdata = require('./telugusonglist.json');




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
   var username=req.body.name;
    User.getUserByUsername(username, function (err, username) {
         console.log(username);
        
        if (username) {
            console.log('existing user');
            return res.status(409).send("The specified username address already exists.");
            /*resp.render('sign.ejs', {
                    viewVariable: "User already exists, please choose another user."
            })*/
        } else {
            console.log(username);
            if (req.body.name &&
        req.body.email &&
        req.body.password &&
        req.body.confpassword)

        if (req.body.password !== req.body.confpassword) {
            var err = new Error("passwords do not match");
            err.status = 400;
            res.redirect('sign');
        } else {

            var newUser = new User({
                username: req.body.name,
                email: req.body.email,
                password: req.body.password,
                created :Date.now()
            });
            console.log("All data captured in backend" + newUser.username + "," + newUser.email + "," + newUser.password + Date.now());

            User.createUser(newUser, function (err, user) {
                if (err) throw err;
                res.redirect('login');

            });

        }

        }
    });
    

   /* if (req.body.name &&
        req.body.email &&
        req.body.password &&
        req.body.confpassword)

        if (req.body.password !== req.body.confpassword) {
            var err = new Error("passwords do not match");
            err.status = 400;
            res.redirect('sign');
        } else {

            var newUser = new User({
                username: req.body.name,
                email: req.body.email,
                password: req.body.password,
                created :Date.now()
            });
            console.log("All data captured in backend" + newUser.username + "," + newUser.email + "," + newUser.password + Date.now());

            User.createUser(newUser, function (err, user) {
                if (err) throw err;
                res.redirect('login');

            });

        }*/

});


app.get('/login', function (req, res) {
    console.log("In /login", req.isAuthenticated());
    console.log("In /login", req.body);
    res.render('login.ejs');

});

/*passport.authenticate('local', { failureRedirect: '/login' }),*/
app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login'
}), function (req, res) {
     console.log(req);
    console.log("In POST LOGIN /login", req.isAuthenticated());
    //console.log("In  POST LOGIN /login", req.body);
    retStatus = 'Success';
    var username= req.user.username;
    console.log("In POST LOGIN /login", username);
     UserDetails.getUserDetailsByUsername(username, function (err, username) {
         console.log(username);
        
        if (username) {
            console.log('existing user');
            res.redirect("thanks");
            /*resp.render('sign.ejs', {
                    viewVariable: "User already exists, please choose another user."
            })*/
        } else {
            res.redirect("mywelcomepage");
        }
    });
    
});

app.get('/mywelcomepage',function(req, res){
    var username= req.user.username;
   UserDetails.getUserDetailsByUsername(username, function (err, username) {
         console.log(username);  
        if (username) {
            console.log('existing user');
            res.redirect("thanks");
            /*resp.render('sign.ejs', {
                    viewVariable: "User already exists, please choose another user."
            })*/
        } else {
             res.render('mywelcomepage', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user
        });

    }
            
  });
});


app.get('/index',function(req, res){
        res.render('index', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user
    });
});


app.get('/mysonglist',function(req, res){
        res.render('mysonglist.ejs', {
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

app.get('/spiritualtalks',function(req, res){
        res.render('spiritualtalks.ejs', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user
    });
  });

/*app.get('/userdetails',function(req, res){
        res.render('mywelcomepage', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user
    });
  });*/


app.post('/userdetails',function(req, res){
        console.log("----------------Am I in the Users Details Post---------");
        console.log(req.body);

        var agegroup = req.body.ageradio;
        var purpose= req.body.selectGoal;
        var name = req.user.username;

        var uDetails = new UserDetails({
                username: req.user.username,
                agegroup: req.body.ageradio,
                purpose: req.body.selectGoal,  
                created :Date.now()
            });

         
         console.log("All data captured in backend" + uDetails.agegroup + "," + uDetails.purpose + "," + uDetails.username + Date.now());

           UserDetails.createuserdetails(uDetails, function (err, user) {
                if (err) throw err;
                res.render('thanks',{
                  isAuthenticated: req.isAuthenticated(),
                   user: req.user  
                });

            });

  });

    app.get('/thanks',function(req,res){
        res.render('thanks', {
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
