var express = require("express");
var app = express();

var expresshbs = require("express-handlebars");
var flash = require("connect-flash");
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');

var shortid = require("shortid");
var multer = require("multer");
var upload = multer();
var storage = multer.diskStorage({
	destination : function(req, file, cb){
		cb(null, __dirname + "/assets/uploads");
	},
	filename : function(req, file, cb){
		cb(null, shortid.generate());
	}
});

var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var secret = "orcinus orca";

var mongoose = require("mongoose");

mongoose.connect('mongodb://orcas:lunaisbestpony@localhost/orcas');

var models = require("./models")(mongoose);

var User = models.User;
var Person = models.Person;
var File = models.File;

app.use(express.static(__dirname + '/assets'));

app.use(cookieParser());
app.use(app.session = session({
	secret : secret,
	store : new MongoStore({
		mongooseConnection: mongoose.connection
	})
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

passport.use(new LocalStrategy(function (username, password, done) {
	User.findOne({username: username}, function (err, user) {
		if (err) {
			done(err);
			return;
		}
		if (!user) {
			done(null, false, { message: 'No such user.' });
			return;
		}
		if(password == user.password){
			done(null, user);
		}else{
			done(null, false, { message: 'Incorrect password.' });
		}
	});
}));
passport.serializeUser(function (user, done){
	done(null, user.id);
});
passport.deserializeUser(function(id, done) {
	User.findOne({_id : id}, function(err, user){
		if(user){
			done(null, user);
		}
	})
});

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.engine('handlebars', expresshbs({defaultLayout : 'main'}));
app.set('view engine', 'handlebars');

app.use(function(req, res, next){
	res.data = {user : req.user};
	next();
});

app.get('/', function(req, res){
	if(req.user){
		res.data.imgs = [];
		for(var i = 0; i < user.files.length; i++){
			res.data.imgs.push(user.files[i].url);
		}
		res.render('home', res.data);
	}else{
		res.render('login');
	}
});

app.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login', failureFlash: true}));

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

app.get('/register', function(req, res){
	res.render('register');
});
app.post('/register', function(req, res){
	if(req.body.password == req.body.passwordconfirm){
		var user = new User({
			username : req.body.username,
			password : req.body.password,
			description : ""
		});
		user.save();
		console.log(user);
		res.redirect('/');
	}else{
		req.flash("error", "Passwords do not match!");
	}
});
app.get('/upload', function(req, res){
	res.render('upload');
});
app.post('/upload', upload.single('uploader'), function(req, res){
	var newfile = new File({
		tags : req.body.tags.split(" "),
		type : req.file.mimetype,
		url : req.file.path
	});
	user.files.push(newfile);
	user.save();
	newfile.save();
});
app.get('/search', function(req, res){
	res.data.imgs = [];
	var terms = req.body.searchterms.split(" ");
	File.find({}, function(err, files){
		for(var i = 0; i < files.length; i++){
			for(var j = 0; j < terms.length; j++){
				if(files[i].tags.indexOf(terms[j]) != -1){
					res.data.imgs.push(files[i].url);
					break;
				}
			}
		}
	});
	res.render('home', res.data);
});
app.listen(10201, function(){
	console.log("Listening");	
});
