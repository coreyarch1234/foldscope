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

//Note model
var Note = require('./models/post/post.js');

//Date Converter
var dateConverter = require('./helpers/convert-date.js');

var port = 3000;

var mongodb = require("mongodb");
// Setting up Database
var mongoose = require('mongoose');

// Use bluebird
mongoose.Promise = require('bluebird');
// assert.equal(query.exec().constructor, require('bluebird'));
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/foldscope', {
  useMongoClient: true,
  /* other options */
});

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Setting templating engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));


var groupURL = "https://microcosmos.foldscope.com/";

//Object containing all post attributes
var newsFeed = {};
//Array containing all post objects
var allJSONInfo = [];
//Array of URL attributes of all posts
var arrayURLS = [];

//Routes
app.get('/', function(req,res){
  Note.find({isWP: true},function(err, docs){
      if (err) throw error;
      res.send(docs)
  })
});

//route to handle iOS post request
app.post('/', function(req,res){
    Note.find({isWP: true},function(err, docs){
        if (err) throw error;
        res.send(docs)
    })
});


var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    app.listen(process.env.PORT || port, function() {
        // console.log(process.env.PORT);
        console.log("Started at: " + port);
        var latestPostURL = '';
        Note.findOne({}, {}, { sort: { '_id' : -1 } }, function(err, note) {
            // console.log("the latest post");
            // console.log( note.postURL );
            latestPostURL = note.postURL;
        });
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
                            if (link == latestPostURL){
                                console.log("they are equal");
                                return false;
                            }else{
                                console.log("still pushing");
                                arrayURLS.push(link);
                            }
                            // arrayURLS.push(link);
                        }
                    }
                });
                var feed = arrayURLS
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

                arrayURLS = newarr;
                // console.log(arrayURLS);
                if (arrayURLS.length > 0){
                    scraper(arrayURLS.pop());
                }else{
                    console.log("we are done early");
                }
            }else{
                console.log("An error occurred with scraping");
            }
        });
    })
})

//array of links is arrayURLS


//lookup links
function lookupLink(noteBody, callback){
    console.log("MORE TIME ADDED");
    Note.findOne({postURL: noteBody.postURL}, function(err, note){
        if (note == null){
            Note.create(noteBody, function(err, note){
                if (err) {
                    console.log(err);
                } else {
                    callback();
                }
            })
        }else{
            callback();
        }
    })
}

function resolveLinks() {
    if (arrayURLS.length > 0 ) {
        return arrayURLS.pop();
    }
    return undefined;
}

function scraper(url){
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
            //Convert date
            // var newDate = convertDate(date);
            var newDate = dateConverter(date);
            //Category
            var category = $("[rel='category']").text();
            //url
            var wordPressURL = url;
            //main header image
            var headerImageURL = $('meta[property="og:image"]').attr('content');
            //short intro description
            var description = ""
            $(".entry-content p").each(function(){
                description += $(this).text();
                if (description.length > 200){
                    return false
                }
            })
            var length = 200;
            var description = description.substring(0, length);
            newsFeed = {
                title: title,
                author: author,
                formatDate: newDate,
                date: date,
                category: category,
                postURL: wordPressURL,
                imageURL: headerImageURL,
                description: description,
                isWP: true
            }
            lookupLink(newsFeed, function(){
                var nextLink = resolveLinks();
                if (nextLink != undefined){
                    console.log("next Link is: " + nextLink);
                    scraper(nextLink);
                }else{
                    console.log("all notes saved");
                }
            })
        }else{
            console.log("An error occurred with scraping");
        }
    });
}
