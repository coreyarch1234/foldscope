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

//run scrape function and return data
// scrapeFeed();

app.get('/', function(req,res){
    res.json({ title: 'Foldscope in the field',
    author: 'Manu Prakash',
    date: 'August 23, 2017',
    category: 'Uncategorized',
    postURL: 'https://microcosmos.foldscope.com/?p=26651',
    imageURL: 'No image available',
    isWP: true });
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
