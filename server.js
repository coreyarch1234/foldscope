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

var _ = require('lodash');

var _ = require('lodash/core');
// Load the FP build for immutable auto-curried iteratee-first data-last methods.
var fp = require('lodash/fp');

var array = require('lodash/array');
var object = require('lodash/fp/object');

// var includes = require('lodash/collections/includes');


var port = 3000;

var mongodb = require("mongodb");
// Setting up Database
var mongoose = require('mongoose');
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/foldscope', { useMongoClient: true });

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
var scraperFeed = require('./scrapers/scraper.js');
var groupURL = "https://microcosmos.foldscope.com/";

var newsFeed = {};
var allJSONInfo = [];
var arrayURLS = [];
var allFeed = [];

var global_count = 0;
var urlArray = [];

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

            var headerImageURL = $('meta[property="og:image"]').attr('content');

            newsFeed = {
                title: title,
                author: author,
                date: date,
                category: category,
                postURL: wordPressURL,
                imageURL: headerImageURL,
                isWP: true
            }
            allJSONInfo.push(newsFeed);
            return newsFeed;
        }else{
            console.log("An error occurred with scraping");
        }
    });
}
function something(callback){
    callback(groupURL);
}

function jsonInterval(feed){
    var i = 0;
    //promises to ensure no duplicate posts
    let urlArrayFill = function(){
        return new Promise(function(resolve, reject){
            db.collection("posts").find({isWP: true}).toArray(function(err, docs){
                if (err) throw error;
                if (global_count == 0){
                    resolve([]);
                }else{
                    for (var i = 0; i < global_count; i++){
                        console.log("global count is: " + global_count);
                        console.log("i is: " + i);
                        if (i == (global_count - 1)){
                            console.log("array of urls");
                            console.log(urlArray);
                            resolve(urlArray)
                        }
                        if (urlArray.includes(docs[i].postURL) == false){
                            urlArray.push(docs[i].postURL);
                        }
                    }
                }
            })
        })
    }
    var requestLoop = setInterval(function(){
        if (i == feed[0].newarr.length){
            clearInterval(requestLoop);
        }else{
            getJSONInfo(feed[0].newarr[i]);
        }
        console.log("i = " + i);
        console.log(allJSONInfo);
        console.log();
        if (i >= 1){
            urlArrayFill().then(function(result){
                console.log("result is: ")
                console.log(result)
                db.collection("posts").find({isWP: true}).toArray(function(err, docs){
                    if (err) throw error;
                    if (result.includes(allJSONInfo[allJSONInfo.length - 1].postURL)){
                        console.log("we have a duplicate");
                    }else{
                        console.log("we don't have a duplicate");
                        db.collection("posts").insertOne(allJSONInfo[allJSONInfo.length - 1], function(err, doc) {
                            if (err) {
                                console.log(err);
                            } else {
                                //update global count
                                global_count ++;
                                console.log("saved successfully");

                            }
                        });
                    }
                })
            })
        }
        i++;
  }, 3000);
}
function getPosts(){
    var feed = allFeed[0].arrayURLS
      var newarr = (function(feed){
      var m = {}, newarr = []
      for (var i=0; i<feed.length; i++) {
        var v = feed[i];
        if (!m[v]) {
          newarr.push(v);
          m[v]=true;
        }
      }
      return newarr;
  })(feed);
    allJSONInfo = [{newarr}]
    db.collection("posts").count({isWP: true}, function(err, count){
        console.log("here is the count: " + count);
        global_count = count;
        jsonInterval(allJSONInfo);
    })
}
app.get('/', function(req,res){
  db.collection("posts").find({isWP: true}).toArray(function(err, docs){
      if (err) throw error;
      res.send(docs)
  })
});

//route to handle iOS post request
app.post('/', function(req,res){
    db.collection("posts").find({isWP: true}).toArray(function(err, docs){
        if (err) throw error;
        res.send(docs)
    })
});

var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost/foldscope', function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }


  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");


  // Initialize the app.
  // Deploy
  app.listen(process.env.PORT || port, function() {
      // console.log(process.env.PORT);
      console.log("Started at: " + port);
      request(groupURL, function(error, response, body){
          console.log("got to post scrape method");
          if (!error){
              var $ = cheerio.load(body);
              //find all urls
              var wordPressURLSet = groupURL;
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
              console.log("allFeed is done");
              console.log(allFeed);
              getPosts();
              return newsFeed;
          }else{
              console.log("An error occurred with scraping");
          }
      });
      //if mongodb has 0 WP posts, then populate with scrapeFeed.
      //if not, then do nothing.

  })
});
