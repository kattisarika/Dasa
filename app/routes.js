var User = require('./models/user');
module.exports = function(app){
	app.get('/', function(req, res){
		res.render("index.ejs")
	});

	app.get('/contact',function(req, res){
		res.render("contact.ejs")
	});

	app.get('/login',function(req,res){
		res.render("login.ejs")

	});

	app.get('/sign', function(req,res){
		res.render("sign.ejs");
	});




	app.get('/yoursong', function(req,res){
		res.render("yoursong.ejs");
	});

	app.get('/aboutus', function(req,res){
		res.render("aboutus.ejs");
	});

	app.get('/songs',function(req,res){
		res.render("songlist.ejs");
	})



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
}