//Middleware

//Express
var express = require('express');
var exphbs  = require('express-handlebars');
//App
var app = express();
//To parse post requests
var bodyParser = require('body-parser');
//request to merge HTTP and HTTPS
var request = require("request");
//cheerio to work with downloaded web data using jquery on the server
cheerio = require("cheerio");

// //web page to scrape
// var url = "https://microcosmos.foldscope.com/?p=26017";
// var groupURL = "https://microcosmos.foldscope.com/";
//
// var newsFeed = {}
// var allJSONInfo = []
// var arrayURLS = [];
// var allFeed = []
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

//scrape functions
var scrapeFeed = require('./scrapers/scrape.js');

//run scrape function and return data
scrapeFeed();

app.get('/', function(req,res){
});

//route to handle iOS post request
app.post('/', function(req,res){
});

// Deploy
app.listen(process.env.PORT || port, function() {
    // console.log(process.env.PORT);
    console.log("Started at: " + port);
})
