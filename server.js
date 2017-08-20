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
var url = "https://microcosmos.foldscope.com/?p=26017";
var groupURL = "https://microcosmos.foldscope.com/";

var newsFeed = {}
var allJSONInfo = []
var arrayURLS = [];
var allFeed = []
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

function getJSONInfo(url){
    request(url, function(error, response, body){
        if (!error){
            var $ = cheerio.load(body);
            var blogText = $.text();
            var blogHTML = $.html();

            //Title
            var title = $('h1.entry-title').text().trim();
            //Author
            var author = $('span.author').text();
            //Date
            var date = $('time.entry-date').text();
            //Category
            var category = $("[rel='category']").text();
            //url
            var wordPressURL = url;
            //main header image
            if ($('div.entry-media-thumb').length > 0){
                var headerImageURL = $('div.entry-media-thumb').css('background-image');
                headerImageURL = headerImageURL.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
            }else if ($('div.site-banner-thumbnail').length > 0){
                var headerImageURL = "No image available";
            }else {
                var headerImageURL = "No image available";
            }

            newsFeed = {
                title: title,
                author: author,
                date: date,
                category: category,
                wordPressURL: wordPressURL,
                headerImageURL: headerImageURL
            }
            allJSONInfo.push(newsFeed);
            return newsFeed;
        }else{
            console.log("An error occurred with scraping");
        }
    });
}
function postScrape(url) {
    request(url, function(error, response, body){
        console.log("got to post scrape method");
        if (!error){
            var $ = cheerio.load(body);
            //find all urls
            var wordPressURLSet = url;
            var wordPressURLReg = /(https:\/\/microcosmos.foldscope.com\/\?p=\d+)/;
            var link = "";
            var allURL = $('a').each(function(){
                link = $(this).attr('href');
                if (wordPressURLReg.test(link)){
                    if (link.indexOf("#") !=-1) {
                        // console.log("this is a comment and should not be included");
                    }else{
                        // console.log(link);
                        arrayURLS.push(link);
                    }
                }
            });
            newsFeed = {
                arrayURLS: arrayURLS
            }
            allFeed.push(newsFeed);
            return newsFeed;
        }else{
            console.log("An error occurred with scraping");
        }
    });
}
app.get('/', function(req,res){
    console.log("Started");
    console.log("Production Port" + process.env.PORT);
    let createGroup = function(){
        return new Promise(function(resolve, reject){
            y = 0;
            var requestLoopGroup = setInterval(function(){
                if (y == 1){
                    console.log("resolving and y is: " + y);
                    resolve(allFeed);
                    clearInterval(requestLoopGroup);
                }else{
                    console.log("about to post scrape");
                    postScrape(groupURL);
                }
                y++;
          }, 5000);
        })
    }
    let createIndividual = function(feed){
        return new Promise(function(resolve, reject){
            var i = 0;
            console.log(allJSONInfo)
            feed = feed.filter(function(elem, pos) {
                return feed.indexOf(elem) == pos;
            })
            console.log(feed);
            console.log(feed.length);
            var requestLoop = setInterval(function(){
                if (i == feed.length){
                    console.log(allJSONInfo)
                    //convert to json
                    finalJSON = {};
                    for (i=0; i<allJSONInfo.length; i++){
                        var index = i.toString();
                        finalJSON[index] = allJSONInfo[i];
                    }
                    console.log("finalJSON ---------");
                    console.log(finalJSON)
                    res.json(finalJSON)
                    clearInterval(requestLoop);
                }else{
                    getJSONInfo(feed[i]);
                }
                i++;
          }, 3000);
        })
    }

    createGroup().then(function(result){
        console.log("allFeed object:");
        console.log(allFeed);
        createIndividual(allFeed[0].arrayURLS);
    })
});

//route to handle iOS post request
app.post('/', function(req,res){
    console.log("Started");
    console.log("Production Port" + process.env.PORT);
    let createGroup = function(){
        return new Promise(function(resolve, reject){
            y = 0;
            var requestLoopGroup = setInterval(function(){
                if (y == 1){
                    console.log("resolving and y is: " + y);
                    resolve(allFeed);
                    clearInterval(requestLoopGroup);
                }else{
                    console.log("about to post scrape");
                    postScrape(groupURL);
                }
                y++;
          }, 5000);
        })
    }
    let createIndividual = function(feed){
        return new Promise(function(resolve, reject){
            var i = 0;
            console.log(allJSONInfo)
            feed = feed.filter(function(elem, pos) {
                return feed.indexOf(elem) == pos;
            })
            console.log(feed);
            console.log(feed.length);
            var requestLoop = setInterval(function(){
                if (i == feed.length){
                    console.log(allJSONInfo)
                    //convert to json
                    finalJSON = {};
                    for (i=0; i<allJSONInfo.length; i++){
                        finalJSON[i] = allJSONInfo[i];
                    }
                    console.log("finalJSON ---------");
                    console.log(finalJSON)
                    res.json(finalJSON)
                    clearInterval(requestLoop);
                }else{
                    getJSONInfo(feed[i]);
                }
                i++;
          }, 3000);
        })
    }

    createGroup().then(function(result){
        console.log("allFeed object:");
        console.log(allFeed);
        createIndividual(allFeed[0].arrayURLS);
    })
});

// Deploy
app.listen(process.env.PORT || port, function() {
    // console.log(process.env.PORT);
    console.log("Started at: " + port);
})
