//Middleware
var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();

var bodyParser = require('body-parser');
var mongodb = require("mongodb");
var mongoose = require('mongoose');

//Note model
var Note = require('./models/note/note.js');

var dateConverter = require('./helpers/convert-date.js');

var port = 3000;

var dateTime = require('node-datetime');
var fs = require('fs');
var cron = require('node-cron');
//request to merge HTTP and HTTPS
var request = require("request");
//cheerio to work with downloaded web data using jquery on the server
var cheerio = require("cheerio");

var fetch = require('node-fetch');

var request = require('request');



// Use bluebird
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/foldscope', {
  useMongoClient: true,
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

var groupURLArray = [
    "https://microcosmos.foldscope.com/?m=201709",
    "https://microcosmos.foldscope.com/?m=201708",
    "https://microcosmos.foldscope.com/?m=201707",
    "https://microcosmos.foldscope.com/?m=201706"
];

var blogHTML = '';
var blogText = '';

var endOfLinkCreation = false;

var moment = require('moment');

var current = moment();
var currentPage = 1;
var currentDateURL = 'https://microcosmos.foldscope.com/?m=' + current.format('YYYYMM') + '&paged=' + currentPage;

var finalDate = moment("2014-11");

var doesExist = true;

var nextGroupLink = '';

//Object containing all post attributes
var newsFeed = {};

//Array of URL attributes of all posts
var arrayURLS = [];

var dataHTML = require('./htmlTest');


//serves static static
app.get('/:id', (req, res) => {
    res.sendFile(`${req.params.id}.html`, { root: './mobile_sites' });
});
//Routes
app.get('/', function(req,res){
  //send back docs paginated.
  var pageSize = 75;
  var pageNumber = req.body.pageNumber;
  Note.find({isWP:true}).sort({"order_ID": -1}).skip(pageSize * (pageNumber - 1)).limit(pageSize).exec(function(err, docs){
      if (err) throw error;
      res.send(docs)
  })
});

//route to handle iOS post request
app.post('/', function(req,res){
    //send back docs paginated
    var pageSize = 75;
    var pageNumber = req.body.pageNumber;
    Note.find({isWP:true}).sort({"order_ID": -1}).skip(pageSize * (pageNumber - 1)).limit(pageSize).exec(function(err, docs){
        if (err) throw error;
        res.send(docs)
    })
});

app.get('/html', function (req, res) {
    res.send(dataHTML);
});


var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    app.listen(process.env.PORT || port, function() {
        console.log("env port" + process.env.PORT);
        groupScrapeLink(currentDateURL);
        // //cron job every 1 min
        // cron.schedule('* * * * * *', function(){
        //   console.log('%%%%%%%%%%%%%%RUNNING THIS EVERY MINUTE%%%%%%%%%%%%%%%%%');
        //   groupScrapeLink(currentDateURL);
        // });
    })
});

function groupScrapeLink(groupURL){
    console.log("reached group scrape link");
    request(groupURL, function(error, response, body){
        console.log("got to post scrape method");
        if (!error){
            arrayURLS = [];
            console.log(arrayURLS);
            console.log(groupURL)
            var $ = cheerio.load(body);
            //find all urls
            var wordPressURLSet = groupURL;
            var wordPressURLReg = /(https:\/\/microcosmos.foldscope.com\/\?p=\d+)/;
            var link = "";
            console.log(arrayURLS);
            var allURL = $('a.cover-link').each(function(){
                link = $(this).attr('href');
                if (wordPressURLReg.test(link)){
                    if (link.indexOf("#") !=-1) {
                        // console.log("this is a comment and should not be included");
                    }else{
                        console.log("<--------------------->");
                        console.log("being pushed: " + link);
                        console.log("<--------------------->");
                        arrayURLS.push(link);
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
            console.log(arrayURLS);
            arrayURLS.reverse();
            if (arrayURLS.length > 0){
                scraper(arrayURLS.pop());
            }else{
                console.log("we are done early");
            }


        }else{
            console.log("An error occurred with scraping");
            console.log(error);
        }
    });
}

function scraper(url){
    //Manipulate the post to madhur specs
    // Save html under filename "postID.html" in a folder
    //send to madhur over slack.
    request(url, function(error, response, body){
        if (!error){
            var $ = cheerio.load(body);
            var blogText = $.text();
            var blogHTML = $.html();


            //deleting styles
            $("link[rel='stylesheet']").remove();
            $("style[type='text/css']").remove();
            $("div.sharedaddy").remove();
            $("div.jp-relatedposts").remove();
            $("nav.post-navigation").remove();
            $("a.add-comment-link").remove();
            $("a.comment-reply-login").remove();
            $("div.comment-respond").remove();
            $("footer").remove();
            $("span.says").remove();

            var timeClass = $('time').attr('class');
            var timeClassArray = timeClass.split(' ');
            if (timeClassArray.length == 2) {
                $("time.updated").remove();
            }

            $("a.skip-link").empty();
            $("header.site-header").empty();

            var siteBanner = $('div.site-banner-thumbnail').attr('title');

            if (siteBanner===undefined) {
              $('div.site-content').addClass('top-margin');
            }


            //replacing

            var imageCount = $(".entry-content").find('img').length;

            if (imageCount===0) {
              var headerImageURL = $('meta[property="og:image"]').attr('content');
              if (headerImageURL!=='https://s0.wp.com/i/blank.jpg') {
                $('<img src="' + headerImageURL +'" style=\"width: 90%;padding: 5px 0px;border-radius: 10px;position: relative;left: 50%;transform: translate(-50%, 0%);display: block;\">').insertBefore('div.entry-content');
              }
            }

            var hasComments = $(".comments-area").find('.comments-title').length;
            if (hasComments!==0) {
                var commentString = $('h2.comments-title').html().replace(/\s/g, '');

                if (commentString === 'OneComment') {
                  $('h2.comments-title').replaceWith('<h2 class="comments-title">1 Comment</h2>');
                }
            }

            var hasPrevPostLink = $('blockquote.wp-embedded-content > p').length;

            if (hasPrevPostLink>0) {
              $('<div class="default-image-container"></div>').prependTo('blockquote.wp-embedded-content');
              $('<img class="default-image" src="http://madhur.xyz/foldscope.jpg">').prependTo('.default-image-container');
            }

            var hasTitle = $('h1.entry-title').length;

            if (hasTitle===0) {
              $('div.entry-posted').addClass('title-space');
            }

            var spanContent = $("span[style='font-size: 1.8rem']").contents();
            $("span[style='font-size: 1.8rem']").replaceWith(spanContent);


            //adding
            $('head').append('<link href="https://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,700" rel="stylesheet">');
            $('head').append('<link rel="stylesheet" href="styles/main.css">');
            $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">');
            $('head').append("<link rel='stylesheet' id='jetpack_css-css' href='https://microcosmos.foldscope.com/wp-content/plugins/jetpack/css/jetpack.css?ver=4.3.1' type='text/css' media='all'/>");
            $('body').append("<link rel='stylesheet' id='mediaelement-css' href='https://microcosmos.foldscope.com/wp-includes/js/mediaelement/mediaelementplayer.min.css?ver=2.22.0' type='text/css' media='all'/>");
            $('body').append("<link rel='stylesheet' id='wp-mediaelement-css' href='https://microcosmos.foldscope.com/wp-includes/js/mediaelement/wp-mediaelement.min.css?ver=4.6.6' type='text/css' media='all'/>");
            blogText = $.text();
            blogHTML = $.html();
            console.log("has title: " + hasTitle);

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

            //ID to order. Take ID end string of URL
            var order_ID = url.split("=").pop();
            var headerImageURL = $('meta[property="og:image"]').attr('content');
            //short intro description
            var description = " ";
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
                order_ID: order_ID,
                isWP: true
            }
            // save blogHTML to a folder
            var id_html = "./mobile_sites/" + order_ID.toString() + ".html";


            fs.writeFile(id_html, blogHTML, function(err){
                if(err){
                    return console.log(err);
                }
                console.log("The file was saved!");
            })
            lookupLink(newsFeed, function(){
                var nextLink = resolveLinks();
                if (nextLink != undefined){
                    console.log("next Link is: " + nextLink);
                    scraper(nextLink);
                }else{
                    console.log("all notes saved");
                    //this is if we found a duplicate
                    if (endOfLinkCreation == true){
                        return
                    }else{
                        console.log("current is: " + current.format());
                        //We have not found a duplicate and we call nextDate to change current date to one less month
                        giveNextDate(current);

                    }
                }
            })
        }else{
            console.log("An error occurred with scraping");
        }
    });
}


function resolveLinks() {
    if (arrayURLS.length > 0 ) {
        return arrayURLS.pop();
    }
    return undefined;
}

//lookup links
function lookupLink(noteBody, callback){
    console.log("MORE TIME ADDED");
    console.log(noteBody);
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
            // callback();
            console.log("we found a duplicate link and we will stop creating");
            endOfLinkCreation = true;
        }
    })
}


function giveNextDate(currentPass){
    console.log("We are in the giveNextDate function");
    console.log("<--------------------->");

    currentPage = currentPage + 1;

    var currentURL = 'https://microcosmos.foldscope.com/?m=' + currentPass.format('YYYYMM') + '&paged=' + currentPage;

    console.log("the currentPass is: " + currentPass.format());
    console.log("the final date is: " + finalDate.format());

    //check if we are less than the final date. if so, return undefined
    if (currentPass < finalDate){
        console.log("current is less than final");
        nextGroupLink = undefined;
        console.log("all group links scraped");
        console.log("the current date is: " + current);
        console.log(nextGroupLink);
        return
    }

    console.log('the current url is: ' + currentURL);

    //check if page exists. if not, decrement year and reset current page to 0. then call giveNextDate with currentDate again
    checkPage(currentURL, function(doesExist){
        if (doesExist == false){
            //decrement current by a month.
            console.log("the current date is: " + current.format());
            current.subtract(1, 'months');
            console.log("the current date after subtraction is: " + current.format())
            currentPage = 0
            giveNextDate(current)
        }else{
            nextGroupLink = 'https://microcosmos.foldscope.com/?m=' + currentPass.format('YYYYMM') + '&paged=' + currentPage;
            // callback(nextGroupLink);
            console.log("we are stuck")
            if (nextGroupLink != undefined){
                console.log("next Group Link is: " + nextGroupLink);
                //reset array of urls
                // arrayURLS = [];
                console.log("<--------------------->");
                console.log("the nextGroupLink is: ");
                console.log(nextGroupLink);
                console.log("<--------------------->");
                groupScrapeLink(nextGroupLink);
            }else{
                console.log("all group links scraped");
                console.log("the current date is: " + current);
                console.log(nextGroupLink);
                return
            }
        }
    })
}

//to see if page exists
function checkPage(url, callback){
    request(url, function(error, response, body){
        console.log("got to post scrape method");
        if (!error){
            var $ = cheerio.load(body); //find all urls
            var pageExist = $('body').hasClass('error404');

            if (pageExist == true){
                doesExist = false;
                console.log("page does NOT exist and calling callback");
                callback(doesExist);
            }else{
                doesExist = true;
                console.log("page does  exist and calling callback");
                callback(doesExist);
            }
        }else{
            console.log("An error occurred with scraping");
            console.log(error);
        }
    });
}
