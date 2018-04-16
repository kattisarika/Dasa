var User = require('./models/user');
module.exports = function(app){
	


	app.get('/', function(req, res){
		res.render("index.ejs")
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


   
	app.get('/login',function(req,res){
		res.render("login.ejs")

	});

	app.get('/sign', function(req,res){
		console.log("DO I GET REGISTER GET CALLED ");
    	res.render('sign.ejs');
	});

    app.post('/sign', function(req, res){
    	console.log(req);
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
            //  console.log("All data captured in backend" + newUser.username + "," + newUser.email + "," + newUser.password);

            User.createUser(newUser, function(err, user) {
                if (err) throw err;
                res.redirect("/login");

            });

        }
	});


	app.get('/:username/:password', function(req, res){
		var newUser = new User();
		newUser.local.username = req.params.username;
		newUser.local.password = req.params.password;
		console.log(newUser.local.username + " " + newUser.local.password);
		newUser.save(function(err){
			if(err)
				throw err;
		});
		res.send("Success!");
	})


	app.get('/yoursong', function(req,res){
		res.render("yoursong.ejs");
	});

	app.get('/aboutus', function(req,res){
		res.render("aboutus.ejs");
	});

	app.get('/songs',function(req,res){
		res.render("songlist.ejs");
	})

}