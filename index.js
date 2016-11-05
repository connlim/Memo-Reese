var express = require("express");
var app = express();

var expresshbs = require("express-handlebars");
var flash = require("connect-flash");
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')
var mongoose = require("mongoose");

var models = require("./models")(mongoose);

var User = models.User;
var Person = models.Person;
var File = models.File;

mongoose.connect('mongodb://localhost/orcas');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//app.use(cookieParser('keyboard cat'));
//app.use(express.session({ cookie: { maxAge: 60000 }}));
//app.use(flash());

app.engine('handlebars', expresshbs({defaultLayout : 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res){
	res.render('login');
});
app.post('/', function(req, res){
	if(!req.body){

	}
	User.findOne({username : req.body.username}, function(err, user){
		if(err || !user){
			
		}
		console.log(user);
		if(user.password == req.body.password){
			res.data = {username : user.username, password : user.password};
			res.render('home', res.data);
		}
	});
	//req.flash('error', "Error logging in");
	res.render('login', {errors : "Error logging in"});
});
app.listen(10201, function(){
	console.log("Listening");	
});
