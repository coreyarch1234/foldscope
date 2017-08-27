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
                postURL: wordPressURL,
                imageURL: headerImageURL,
                isWP: true
            }
            allJSONInfo.push(newsFeed);
            // res.json(allJSONInfo);
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
    db.dropDatabase();
    var requestLoop = setInterval(function(){
        if (i == feed[0].newarr.length){
            db.collection("posts").count({isWP: true}, function(err, count){
                console.log("here is the count: " + count);
            })
            console.log("here are all of the posts: ")
            db.collection("posts").find({isWP: true}, function(err, docs){
                docs.forEach(function(doc){
                    console.log( doc.title + " by " + doc.author);
                });
            })
            clearInterval(requestLoop);
        }else{
            getJSONInfo(feed[0].newarr[i]);
        }
        console.log("i = " + i);
        console.log(allJSONInfo);
        console.log();
        if (i >= 1){
            db.collection("posts").insertOne(allJSONInfo[allJSONInfo.length - 1], function(err, doc) {
                if (err) {
                    // handleError(res, err.message, "Failed to create new contact.");
                    console.log(err);
                } else {
                    console.log("saved successfully");
                    // console.log(allJSONInfo);
                    // getJSONInfo(doc.ops[5], res)
                    // console.log((doc.ops)[0].arrayURLS[5])
                    // console.log(doc.ops[0])
                    // res.status(201).json(doc.ops);
                    // getJSONInfo((doc.ops)[0].arrayURLS[5], res);
                    // res.status(201).json((doc.ops)[0].arrayURLS[5]);

                }
            });
        }

        // if (allJSONInfo.length > 0){
        //     db.collection("posts").count({isWP: true}, function(err, count){
        //
        //         if (count > 0){
        //             console.log("the count is: " + count);
        //             db.collection("posts").insertMany(feed, function(err, doc) {
        //                 if (err) {
        //                     // handleError(res, err.message, "Failed to create new contact.");
        //                     console.log(err);
        //                 } else {
        //                     console.log("saved successfully");
        //                     console.log(allJSONInfo);
        //                     // getJSONInfo(doc.ops[5], res)
        //                     // console.log((doc.ops)[0].arrayURLS[5])
        //                     // console.log(doc.ops[0])
        //                     // res.status(201).json(doc.ops);
        //                     // getJSONInfo((doc.ops)[0].arrayURLS[5], res);
        //                     // res.status(201).json((doc.ops)[0].arrayURLS[5]);
        //
        //                 }
        //             });
        //         }
        //     })
        // }
        // db.collection("posts").count({isWP: true}, function(err, count){
        //
        //     if (count > 0){
        //         console.log("the count is: " + count);
        //         db.collection("posts").insertMany(allJSONInfo, function(err, doc) {
        //             if (err) {
        //                 // handleError(res, err.message, "Failed to create new contact.");
        //                 console.log(err);
        //             } else {
        //                 console.log("saved successfully");
        //                 console.log(allJSONInfo);
        //                 // getJSONInfo(doc.ops[5], res)
        //                 // console.log((doc.ops)[0].arrayURLS[5])
        //                 // console.log(doc.ops[0])
        //                 // res.status(201).json(doc.ops);
        //                 // getJSONInfo((doc.ops)[0].arrayURLS[5], res);
        //                 // res.status(201).json((doc.ops)[0].arrayURLS[5]);
        //
        //             }
        //         });
        //     }else{
        //         db.collection("posts").insertOne(allJSONInfo[0], function(err, doc) {
        //             if (err) {
        //                 // handleError(res, err.message, "Failed to create new contact.");
        //                 console.log(err);
        //             } else {
        //                 console.log("saved successfully");
        //                 console.log(allJSONInfo);
        //                 // getJSONInfo(doc.ops[5], res)
        //                 // console.log((doc.ops)[0].arrayURLS[5])
        //                 // console.log(doc.ops[0])
        //                 // res.status(201).json(doc.ops);
        //                 // getJSONInfo((doc.ops)[0].arrayURLS[5], res);
        //                 // res.status(201).json((doc.ops)[0].arrayURLS[5]);
        //
        //             }
        //         });
        //     }
        // })
        i++;
  }, 3000);
}


app.get('/', function(req,res){
    // allFeed = allFeed.filter(function(elem, pos) {
    //     return allFeed.indexOf(elem) == pos;
    // })
    var feed = allFeed[0].arrayURLS
      var newarr = (function(feed){
      var m = {}, newarr = []
      for (var i=0; i<feed.length / 4; i++) {
        var v = feed[i];
        if (!m[v]) {
          newarr.push(v);
          m[v]=true;
        }
      }
      return newarr;
  })(feed);
    // allFeed = newarr(allFeed);
    // console.log("distinct feed");
    // console.log([{newarr}])
    allJSONInfo = [{newarr}]
    jsonInterval(allJSONInfo);
    // console.log(allJSONInfo);
    // getJSONInfo(allFeed[0].arrayURLS[5], res);
    // console.log("allJSON info inserted");
    // console.log(allJSONInfo);
    // if (allFeed[0].arrayURLS.length > 0){
    //     console.log(allFeed[0].arrayURLS.length);
    //     for (var i = 0; i < allFeed[0].arrayURLS.length / 2; i++){
    //         getJSONInfo(allFeed[0].arrayURLS[i]);
    //         console.log(allFeed[0].arrayURLS[i]);
    //     }
    //     console.log("allJSON info inserted");
    //     console.log(allJSONInfo);
    // }
    // db.collection("posts").count({isWP: true}, function(err, count){
    //     console.log("the count is: " + count);
    // })
    // db.collection("posts").insertMany(allFeed, function(err, doc) {
    //     if (err) {
    //         // handleError(res, err.message, "Failed to create new contact.");
    //         console.log("error");
    //     } else {
    //         // getJSONInfo(doc.ops[5], res)
    //         console.log((doc.ops)[0].arrayURLS[5])
    //         // console.log(doc.ops[0])
    //         res.status(201).json(doc.ops);
    //         // getJSONInfo((doc.ops)[0].arrayURLS[5], res);
    //         // res.status(201).json((doc.ops)[0].arrayURLS[5]);
    //
    //     }
    // });
    // res.json({ title: 'Foldscope in the field',
    // author: 'Manu Prakash',
    // date: 'August 23, 2017',
    // category: 'Uncategorized',
    // postURL: 'https://microcosmos.foldscope.com/?p=26651',
    // imageURL: 'No image available',
    // isWP: true });
    // request(groupURL, function(error, response, body){
    //     console.log("got to post scrape method");
    //     if (!error){
    //         var $ = cheerio.load(body);
    //         //find all urls
    //         var wordPressURLSet = groupURL;
    //         var wordPressURLReg = /(https:\/\/microcosmos.foldscope.com\/\?p=\d+)/;
    //         var link = "";
    //         var allURL = $('a').each(function(){
    //             link = $(this).attr('href');
    //             if (wordPressURLReg.test(link)){
    //                 if (link.indexOf("#") !=-1) {
    //                     // console.log("this is a comment and should not be included");
    //                 }else{
    //                     // console.log(link);
    //                     arrayURLS.push(link);
    //                 }
    //             }
    //         });
    //         newsFeed = {
    //             arrayURLS: arrayURLS
    //         }
    //         allFeed.push(newsFeed);
    //         console.log("allFeed is done");
    //         isDone = true;
    //         console.log(allFeed);
    //         res.json(allFeed);
    //         // return newsFeed;
    //     }else{
    //         console.log("An error occurred with scraping");
    //     }
    // });
});

//route to handle iOS post request
app.post('/', function(req,res){
    var postData = [{ title: 'Foldscope in the field',
    author: 'Manu Prakash',
    date: 'August 23, 2017',
    category: 'Uncategorized',
    postURL: 'https://microcosmos.foldscope.com/?p=26651',
    imageURL: 'No image available',
    isWP: true },
  { title: 'Harpaticoda and some mysterious things',
    author: 'Mitali',
    date: 'August 11, 2017',
    category: 'BiologyEnvironmentNature',
    postURL: 'https://microcosmos.foldscope.com/?p=26623',
    imageURL: 'No image available',
    isWP: true },
  { title: 'It’s a tick! And it is tiny!',
    author: 'tdumont',
    date: 'August 7, 2017',
    category: 'EnvironmentNature',
    postURL: 'https://microcosmos.foldscope.com/?p=26588',
    imageURL: 'https://i0.wp.com/microcosmos.foldscope.com/wp-content/uploads/2017/08/FullSizeRender.jpg?resize=960%2C640&ssl=1',
    isWP: true },
  { title: 'Summer Camp _ part 5',
    author: 'Teni Anbarchian',
    date: 'August 2, 2017',
    category: 'Uncategorized',
    postURL: 'https://microcosmos.foldscope.com/?p=26571',
    imageURL: 'https://i2.wp.com/microcosmos.foldscope.com/wp-content/uploads/2017/08/IMG_9976.jpg?resize=288%2C480&ssl=1',
    isWP: true }];
    db.collection("posts").insertMany(postData, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new contact.");
    } else {
      res.status(201).json(doc.ops);
    }
  });
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
            //   getJSONInfo(allFeed[0].arrayURLS[5]);
            //   getJSONInfo(allFeed[0].arrayURLS[6]);
              return newsFeed;
          }else{
              console.log("An error occurred with scraping");
          }
      });
      //if mongodb has 0 WP posts, then populate with scrapeFeed.
      //if not, then do nothing.

  })

});


// // Deploy
// app.listen(process.env.PORT || port, function() {
//     // console.log(process.env.PORT);
//     console.log("Started at: " + port);
//     //if mongodb has 0 WP posts, then populate with scrapeFeed.
//     //if not, then do nothing.
//
// })
