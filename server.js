//Middleware

//Express
var express = require('express');
var exphbs  = require('express-handlebars');
//App
var app = express();
//To parse post requests
var bodyParser = require('body-parser');
//port 3000
var port = 3000;

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Setting templating engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));


app.get('/', function(req,res){
    console.log("Started");
    res.render('layouts/main');
});
//route to handle iOS post request
app.post('/', function(req,res){
    console.log("Post Success");
    console.log(req.body);
    res.json({ message: 'Message successfully updated!' });
});

// Deploy
app.listen(process.env.PORT || port, function() {
    console.log(process.env.PORT);
    console.log("Started at: " + port);
})
