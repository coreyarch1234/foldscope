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
    // //make a request to web page to scrape
    var newsFeed = {};
    request(url, function(error, response, body){
        if (!error){
            var $ = cheerio.load(body);
            var blogText = $.text();
            var blogHTML = $.html();

            //Title
            var title = $('h1.entry-title').text().trim();
            console.log("The title is")
            console.log(title);

            //Author
            var author = $('span.author').text();

            //Date
            var date = $('time.entry-date').text();

            //Category
            var category = $("[rel='category']").text();

            //url
            var wordPressURL = url;

            //main header image
            var headerImageURL = $('div.entry-media-thumb').css('background-image');
            headerImageURL = headerImageURL.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');

            console.log("Page scraped successfully");
            console.log();
            console.log("The url is " + url);
            console.log(headerImageURL);
            // console.log(blogText);
            // console.log(blogHTML);
            // console.log(title);
            // console.log(author);
            // console.log(date);
            // console.log(category);
            newsFeed = {
                title: title,
                author: author,
                date: date,
                category: category,
                wordPressURL: wordPressURL,
                headerImageURL: headerImageURL
            }
            res.json(newsFeed);
            console.log(newsFeed);
            // res.render('layouts/main', {blog: blogText});
        }else{
            console.log("An error occurred with scraping");
        }
    });
});
//route to handle iOS post request
app.post('/', function(req,res){
    console.log("Post Success");
    // //make a request to web page to scrape
    var newsFeed = {};
    request(url, function(error, response, body){
        if (!error){
            var $ = cheerio.load(body);
            var blogText = $.text();
            var blogHTML = $.html();

            //Title
            var title = $('h1.entry-title').text().trim();
            console.log("The title is")
            console.log(title);

            //Author
            var author = $('span.author').text();

            //Date
            var date = $('time.entry-date').text();

            //Category
            var category = $("[rel='category']").text();

            //url
            var wordPressURL = url;

            //main header image
            var headerImageURL = $('div.entry-media-thumb').css('background-image');
            headerImageURL = headerImageURL.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');

            console.log("Page scraped successfully");
            console.log();
            console.log("The url is " + url);
            console.log(headerImageURL);
            // console.log(blogText);
            // console.log(blogHTML);
            // console.log(title);
            // console.log(author);
            // console.log(date);
            // console.log(category);
            newsFeed = {
                title: title,
                author: author,
                date: date,
                category: category,
                wordPressURL: wordPressURL,
                headerImageURL: headerImageURL
            }
            // res.render('layouts/main', {blog: blogText});
        }else{
            console.log("An error occurred with scraping");
        }
    });
    console.log(newsFeed);
    // res.json(newsFeed);
});

// //make a request to web page to scrape
// function requestWebPage() {
//     request(url, function(error, response, body){
//         if (!error){
//             var $ = cheerio.load(body);
//             var blogText = $.text();
//             var blogHTML = $.html();
//
//             //Title
//             var title = $('h1.entry-title').text();
//
//             //Author
//             var author = $('span.author').text();
//
//             //Date
//             var date = $('time.entry-date').text();
//
//             //Category
//             var category = $("[rel='category']").text();
//
//
//             console.log("Page scraped successfully");
//             console.log();
//             // console.log(blogText);
//             // console.log(blogHTML);
//             console.log(title);
//             console.log(author);
//             console.log(date);
//             console.log(category);
//             var newsFeed = {
//                 title: title,
//                 author: author,
//                 date: date,
//                 category: category
//             }
//             console.log(newsFeed)
//             // res.render('layouts/main', {blog: blogText});
//         }else{
//             console.log("An error occurred with scraping");
//         }
//     })
// };
//
// requestWebPage();


// Deploy
app.listen(process.env.PORT || port, function() {
    // console.log(process.env.PORT);
    console.log("Started at: " + port);
})
