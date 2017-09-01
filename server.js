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

var Note = require('./models/post/post.js');

var port = 3000;

var mongodb = require("mongodb");
// Setting up Database
var mongoose = require('mongoose');
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/foldscope');

// Using `mongoose.connect`...
// var promise = mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/foldscope', {
//   useMongoClient: true,
//   /* other options */
// });

// promise.then(function(db) {
//   /* Use `db`, for instance `db.model()`
// });
// // Or, if you already have a connection
// connection.openUri('mongodb://localhost/myapp', { /* options */ });

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

var newsFeed = {};
var allJSONInfo = [];
var arrayURLS = [];
var allFeed = [];

var global_count = 0;
var urlArray = [];

//Date conversion
// var date = //Whatever date you get from the request
var newDate, dateArray, month, newMonth, day, newDay, year, tempYear, newYear;
var monthDict = {
  "January": "1/",
  "February": "2/",
  "March": "3/",
  "April": "4/",
  "May": "5/",
  "June": "6/",
  "July": "7/",
  "August": "8/",
  "September": "9/",
  "October": "10/",
  "November": "11/",
  "December": "12/",
};
function convertDate(date) {
  dateArray = date.split(" ");
  month = dateArray[0];
  day = dateArray[1];
  year = dateArray[2];
  newMonth = convertMonth(month);
  newDay = convertDay(day);
  newYear = convertYear(year);
  newDate = newMonth+newDay+newYear;
  return newDate;
}
function convertMonth(month) {
  newMonth = monthDict[month];
  return newMonth;
}
function convertDay(day) {
  newDay = day.replace(",", "/");
  return newDay;
}
function convertYear(year) {
  tempYear = year.split("");
  newYear = tempYear[tempYear.length-2] + tempYear[tempYear.length-1];
  return newYear;
}
// newDate = convertDate(date);
var wrongSizes = []

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
            //Convert date
            var newDate = convertDate(date);
            //Category
            var category = $("[rel='category']").text();
            //url
            var wordPressURL = url;
            //main header image
            var headerImageURL = $('meta[property="og:image"]').attr('content');
            //short intro description
            // var description = $('.entry-content p:first-of-type').text();
            var description = ""
            $(".entry-content p").each(function(){
                description += $(this).text();
                if (description.length > 200){
                    return false
                }
            })
            var length = 200;
            var description = description.substring(0, length);
            console.log("the description is: ");
            console.log(description);
            console.log();
            console.log("the description length is: " + description.length);
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
            Note.find({isWP: true}, function(err, docs) {
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
                Note.find({isWP: true}, function(err, docs){
                    if (err) throw error;
                    if (result.includes(allJSONInfo[allJSONInfo.length - 1].postURL)){
                        console.log("we have a duplicate");
                    }else{
                        console.log("we don't have a duplicate");
                        Note.create(allJSONInfo[allJSONInfo.length - 1], function(err, doc) {
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
    Note.count({isWP: true}, function(err, count){
        console.log("here is the count: " + count);
        global_count = count;
        jsonInterval(allJSONInfo);
    })
}

// function jsonInterval(feed){
//     var i = 0;
//     //promises to ensure no duplicate posts
//     let urlArrayFill = function(){
//         return new Promise(function(resolve, reject){
//             db.collection("posts").find({isWP: true}).toArray(function(err, docs){
//                 if (err) throw error;
//                 if (global_count == 0){
//                     resolve([]);
//                 }else{
//                     for (var i = 0; i < global_count; i++){
//                         console.log("global count is: " + global_count);
//                         console.log("i is: " + i);
//                         if (i == (global_count - 1)){
//                             console.log("array of urls");
//                             console.log(urlArray);
//                             resolve(urlArray)
//                         }
//                         if (urlArray.includes(docs[i].postURL) == false){
//                             urlArray.push(docs[i].postURL);
//                         }
//                     }
//                 }
//             })
//         })
//     }
//     var requestLoop = setInterval(function(){
//         if (i == feed[0].newarr.length){
//             clearInterval(requestLoop);
//         }else{
//             getJSONInfo(feed[0].newarr[i]);
//         }
//         console.log("i = " + i);
//         console.log(allJSONInfo);
//         console.log();
//         if (i >= 1){
//             urlArrayFill().then(function(result){
//                 console.log("result is: ")
//                 console.log(result)
//                 db.collection("posts").find({isWP: true}).toArray(function(err, docs){
//                     if (err) throw error;
//                     if (result.includes(allJSONInfo[allJSONInfo.length - 1].postURL)){
//                         console.log("we have a duplicate");
//                     }else{
//                         console.log("we don't have a duplicate");
//                         db.collection("posts").insertOne(allJSONInfo[allJSONInfo.length - 1], function(err, doc) {
//                             if (err) {
//                                 console.log(err);
//                             } else {
//                                 //update global count
//                                 global_count ++;
//                                 console.log("saved successfully");
//
//                             }
//                         });
//                     }
//                 })
//             })
//         }
//         i++;
//   }, 3000);
// }
// function getPosts(){
//     var feed = allFeed[0].arrayURLS
//       var newarr = (function(feed){
//       var m = {}, newarr = []
//       for (var i=0; i<feed.length; i++) {
//         var v = feed[i];
//         if (!m[v]) {
//           newarr.push(v);
//           m[v]=true;
//         }
//       }
//       return newarr;
//   })(feed);
//     allJSONInfo = [{newarr}]
//     db.collection("posts").count({isWP: true}, function(err, count){
//         console.log("here is the count: " + count);
//         global_count = count;
//         jsonInterval(allJSONInfo);
//     })
// }

//Routes
app.get('/', function(req,res){
  // db.collection("posts").find({isWP: true}).toArray(function(err, docs){
  //     if (err) throw error;
  //     res.send(docs)
  // })
  Note.find({isWP: true}).toArray(function(err, docs){
      if (err) throw error;
      res.send(docs)
  })
});

//route to handle iOS post request
app.post('/', function(req,res){
    // db.collection("posts").find({isWP: true}).toArray(function(err, docs){
    //     if (err) throw error;
    //     res.send(docs)
    // })
    Note.find({isWP: true}).toArray(function(err, docs){
        if (err) throw error;
        res.send(docs)
    })
});

app.listen(process.env.PORT || port, function() {
    // console.log(process.env.PORT);
    // Post.posts.drop();
    console.log("Started at: " + port);
    // var note = new Note({
    //     title: "Hello world",
    //     author: "Corey",
    //     formatDate: "08/23/2017",
    //     date: "August 23rd 2017",
    //     category: "Biology",
    //     postURL: "https://microcosmos.foldscope.com/?p=26787",
    //     imageURL: " ",
    //     description: "This is my text",
    //     isWP: true
    // });
    // note.save(function(error, note) {
    //         console.log("Saving.....")
    //         // console.log('our i : ' + i)
    //         if (error){ return error };
    //
    //     });
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
})

// //Define database
// var db;
//
// // Connect to the database before starting the application server.
// mongodb.MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost/foldscope', function (err, database) {
//   if (err) {
//     console.log(err);
//     process.exit(1);
//   }
//
//
//   // Save database object from the callback for reuse.
//   db = database;
//   console.log("Database connection ready");
//
//
//   // Initialize the app.
//   // Deploy
  // app.listen(process.env.PORT || port, function() {
  //     // console.log(process.env.PORT);
  //     console.log("Started at: " + port);
    //   request(groupURL, function(error, response, body){
    //       console.log("got to post scrape method");
    //       if (!error){
    //           var $ = cheerio.load(body);
    //           //find all urls
    //           var wordPressURLSet = groupURL;
    //           var wordPressURLReg = /(https:\/\/microcosmos.foldscope.com\/\?p=\d+)/;
    //           var link = "";
    //           var allURL = $('a').each(function(){
    //               link = $(this).attr('href');
    //               if (wordPressURLReg.test(link)){
    //                   if (link.indexOf("#") !=-1) {
    //                       // console.log("this is a comment and should not be included");
    //                   }else{
    //                       // console.log(link);
    //                       arrayURLS.push(link);
    //                   }
    //               }
    //           });
    //           newsFeed = {
    //               arrayURLS: arrayURLS
    //           }
    //           allFeed.push(newsFeed);
    //           console.log("allFeed is done");
    //           console.log(allFeed);
    //           db.dropDatabase();
    //           getPosts();
    //           return newsFeed;
    //       }else{
    //           console.log("An error occurred with scraping");
    //       }
    //   });
  //     //if mongodb has 0 WP posts, then populate with scrapeFeed.
  //     //if not, then do nothing.
  //
  // })
// });




/*

1) Get all links
2) Scrape Links
3) Insert into mongoDB, the links that are newsFeed
    a) Check for this link
        i) if not exists then Create
4)

var arrayOfLinks = ['google', 'amazon', ...];

scraper(arrayOfLinks.pop());

function resolveLinks() {
    if (arrayOfLinks.length > 0 ) {
        // lookupLink(arrayOfLinks.pop());
        return arrayOfLinks.pop();
    }
    return undefined;
}

function lookupLink(link, callback) {
    Link.find({ link }).then((link) => {
        if (!link) {
            Link.create(link).then((link)=> {
                callback();
            });
        } else {
            callback();
        }
    })
}


function scraper(url) {
    get.body('url', function(body) {
        // scrape body... got link!
        lookupLink(link, function() {
            var nextLink = resolveLinks();
            if (nextLink) {
                scraper(url);
            }
        });
    });
}
*/
