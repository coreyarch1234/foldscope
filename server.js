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

//web page to scrape
url = "https://microcosmos.foldscope.com/?p=26017";

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
    console.log("Production Port" + process.env.PORT);
    res.render('layouts/main');
});
//route to handle iOS post request
app.post('/', function(req,res){
    console.log("Post Success");
    console.log(req.body);
    res.json({ message: 'Message successfully updated!' });
});

// //make a request to web page to scrape
function requestWebPage() {
    request(url, function(error, response, body){
        if (!error){
            var blog = cheerio.load(body);
            // var blogText = blog.text();
            var blogText = blog.html();


            console.log("Page scraped successfully" + blogText);
            // res.render('layouts/main', {blog: blogText});
        }else{
            console.log("An error occurred with scraping");
        }
    })
};

requestWebPage();


// Deploy
app.listen(process.env.PORT || port, function() {
    console.log(process.env.PORT);
    console.log("Started at: " + port);
})
