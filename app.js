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
