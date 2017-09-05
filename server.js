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
var Note = require('./models/note/note.js');

//Date Converter
var dateConverter = require('./helpers/convert-date.js');

var port = 3000;

var mongodb = require("mongodb");
// Setting up Database
var mongoose = require('mongoose');

//to get current date
var dateTime = require('node-datetime');

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


var homeURL = "https://microcosmos.foldscope.com/";

var groupURLArray = [
    "https://microcosmos.foldscope.com/?m=201709",
    "https://microcosmos.foldscope.com/?m=201708",
    "https://microcosmos.foldscope.com/?m=201707",
    "https://microcosmos.foldscope.com/?m=201706"
];

var endOfLinkCreation = false;

var moment = require('moment');

var current = moment();
var currentPage = 1;
var currentDateURL = 'https://microcosmos.foldscope.com/?m=' + current.format('YYYYMM') + '&paged=' + currentPage;

var finalDate = moment("2014-11");

var doesExist = true;

var nextGroupLink = '';




// get latest date
// var dt = dateTime.create();
// var currentYear = dt.format('Y')
// var currentMonth = dt.format('m');
// var currentPage = 1;
// var currentDate = 'https://microcosmos.foldscope.com/?m=' + currentYear + currentMonth + '&paged=' + currentPage;


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
    // app.listen(process.env.PORT || port, function() {
    //     // console.log(process.env.PORT);
    //     console.log("Started at: " + port);
    //     var latestPostURL = '';
    //     Note.findOne({}, {}, { sort: { '_id' : -1 } }, function(err, note) {
    //         // console.log("the latest post");
    //         // console.log( note.postURL );
    //         if (note != null){
    //             latestPostURL = note.postURL;
    //         }
    //     });
    //     request(groupURL, function(error, response, body){
    //         console.log("got to post scrape method");
    //         if (!error){
    //             var $ = cheerio.load(body);
    //             //find all urls
    //             var wordPressURLSet = groupURL;
    //             var wordPressURLReg = /(https:\/\/microcosmos.foldscope.com\/\?p=\d+)/;
    //             var link = "";
    //             var allURL = $('a').each(function(){
    //                 link = $(this).attr('href');
    //                 if (wordPressURLReg.test(link)){
    //                     if (link.indexOf("#") !=-1) {
    //                         // console.log("this is a comment and should not be included");
    //                     }else{
    //                         if (link == latestPostURL){
    //                             console.log("they are equal");
    //                             console.log();
    //                             console.log("latestPostURL:");
    //                             console.log(latestPostURL);
    //                             console.log("-----------");
    //                             console.log("current link:");
    //                             console.log(link);
    //                             return false;
    //                         }else{
    //                             console.log("still pushing");
    //                             arrayURLS.push(link);
    //                         }
    //                         // arrayURLS.push(link);
    //                     }
    //                 }
    //             });
    //             var feed = arrayURLS
    //               var newarr = (function(feed){
    //               var m = {}, newarr = []
    //               for (var i=0; i<feed.length; i++) {
    //                 var v = feed[i];
    //                 if (!m[v]) {
    //                   newarr.push(v);
    //                   m[v]=true;
    //                 }
    //               }
    //               return newarr;
    //           })(feed);
    //
    //             arrayURLS = newarr;
    //             console.log(arrayURLS);
    //             if (arrayURLS.length > 0){
    //                 scraper(arrayURLS.pop());
    //             }else{
    //                 console.log("we are done early");
    //             }
    //         }else{
    //             console.log("An error occurred with scraping");
    //         }
    //     });
    // })

    // app.listen(process.env.PORT || port, function() {
    //     db.dropDatabase();
    //     // console.log(process.env.PORT);
    //     console.log("Started at: " + port);
    //     var groupLink = groupURLArray.pop();
    //     // console.log(groupLink);
    //     groupScrapeLink(groupLink);
    //     // groupScrapeLink(groupLink, function(){
    //     //     console.log("reached callback");
    //     //     var nextGroupLink = resolveGroupLinks();
    //     //     if (nextGroupLink != undefined){
    //     //         console.log("next Group Link is: " + nextGroupLink);
    //     //         groupScrapeLink(nextGroupLink);
    //     //     }else{
    //     //         console.log("all group links scraped");
    //     //         if (arrayURLS.length > 0){
    //     //             scraper(arrayURLS.pop());
    //     //         }else{
    //     //             console.log("we are done early");
    //     //         }
    //     //     }
    //     // })
    // })
    app.listen(process.env.PORT || port, function() {
        db.dropDatabase();
        // console.log(process.env.PORT);
        console.log("Started at: " + port);
        // // get latest date
        // var dt = dateTime.create();
        // var currentDate = dt.format('Ym');
        //
        // //first date (final)
        // var finalDate = '201411'
        console.log("the final date is: " + moment("2014-11").format("YYYYMM"));
        // console.log("the current date is: " + moment().subtract(12, 'months').format('YYYYMM'));
        // console.log("the current date is: " + (moment().subtract(12, 'months').format('YYYYMM') < moment().subtract(11, 'months').format('YYYYMM')));

        // console.log("the first date is: " + finalDate);

        groupScrapeLink(currentDateURL);
        // var groupLink = groupURLArray.pop();
        // console.log(groupLink);
        // groupScrapeLink(groupLink);
        // groupScrapeLink(groupLink, function(){
        //     console.log("reached callback");
        //     var nextGroupLink = resolveGroupLinks();
        //     if (nextGroupLink != undefined){
        //         console.log("next Group Link is: " + nextGroupLink);
        //         groupScrapeLink(nextGroupLink);
        //     }else{
        //         console.log("all group links scraped");
        //         if (arrayURLS.length > 0){
        //             scraper(arrayURLS.pop());
        //         }else{
        //             console.log("we are done early");
        //         }
        //     }
        // })
    })
})

function checkPage(url, callback){
    request(url, function(error, response, body){
        console.log("got to post scrape method");
        if (!error){
            var $ = cheerio.load(body);
            //find all urls

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

//to create all posts
// function giveNextDate(currentPass){
//     console.log("We are in the giveNextDate function");
//     console.log("<--------------------->");
//
//     currentPage = currentPage + 1;
//
//     var currentURL = 'https://microcosmos.foldscope.com/?m=' + currentPass.format() + '&paged=' + currentPage;
//
//     console.log("the currentPass is: " + currentPass.format());
//     console.log("the final date is: " + finalDate.format());
//     //check if we are less than the final date. if so, return undefined
//     if (currentPass < finalDate){
//         console.log("current is less than final");
//         return undefined
//     }
//
//     //check if page exists. if not, decrement year and reset current page to 0. then call giveNextDate with currentDate again
//     checkPage(currentURL, function(doesExist){
//         if (doesExist == false){
//             //decrement current by a month.
//             console.log("the current date is: " + current.format());
//             current.subtract(1, 'months');
//             console.log("the current date after subtraction is: " + current.format())
//             currentPage = 0
//             giveNextDate(current)
//         }else{
//             return 'https://microcosmos.foldscope.com/?m=' + currentPass.format() + '&paged=' + currentPage;
//         }
//     })
// }

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
        // return undefined
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
            // return 'https://microcosmos.foldscope.com/?m=' + currentPass.format() + '&paged=' + currentPage;
        }
    })
}

//For group links

function resolveGroupLinks(){
    if (groupURLArray.length > 0 ) {
        return groupURLArray.pop();
    }
    return undefined;
}



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


//For each link
//array of links is arrayURLS


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
            lookupLink(newsFeed, function(){
                var nextLink = resolveLinks();
                if (nextLink != undefined){
                    console.log("next Link is: " + nextLink);
                    scraper(nextLink);
                }else{
                    // console.log("all notes saved");
                    // var nextGroupLink = resolveGroupLinks();
                    // if (nextGroupLink != undefined){
                    //     console.log("next Group Link is: " + nextGroupLink);
                    //     groupScrapeLink(nextGroupLink);
                    // }else{
                    //     console.log("all group links scraped");
                    // }
                    // console.log("all notes saved");
                    // if (endOfLinkCreation == true){
                    //     return
                    // }else{
                    //     console.log("current is: " + current.format());
                    //     nextGroupLink = giveNextDate(current);
                    //     if (nextGroupLink != undefined){
                    //         console.log("next Group Link is: " + nextGroupLink);
                    //         groupScrapeLink(nextGroupLink);
                    //     }else{
                    //         console.log("all group links scraped");
                    //         console.log("the current date is: " + current);
                    //         console.log(nextGroupLink);
                    //         return
                    //     }
                    //
                    // }
                    console.log("all notes saved");
                    if (endOfLinkCreation == true){
                        return
                    }else{
                        console.log("current is: " + current.format());
                        giveNextDate(current);

                    }
                }
            })
        }else{
            console.log("An error occurred with scraping");
        }
    });
}
