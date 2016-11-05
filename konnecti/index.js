var express = require("express");
var app = express();

var expresshbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mysql = require("mysql");

var connection = mysql.createConnection({
	host : "localhost",
	user : "orcas",
	password : "",
	database : "KonnectiDB"
});

connection.connect();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.engine('handlebars', expresshbs({defaultLayout : 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res){
	res.render('login');
});
app.post('/', function(req, res){
	if(!req.body){

	}
	connection.query(util.format("SELECT * FROM Users WHERE username=%s", req.body.username), function(err, rows, fields){
		if(err) return console.error(err);
		console.log(rows);
	});
});
app.listen(10201, function(){
	console.log("Listening");	
});
