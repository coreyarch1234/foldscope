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
    var postData = { title: 'Foldscope in the field',
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
    isWP: true },
  { title: 'Summer Camp – part 4 (plants and insects)',
    author: 'Teni Anbarchian',
    date: 'August 2, 2017',
    category: 'Uncategorized',
    postURL: 'https://microcosmos.foldscope.com/?p=26551',
    imageURL: 'https://i2.wp.com/microcosmos.foldscope.com/wp-content/uploads/2017/08/IMG_9525.jpg?resize=960%2C640&ssl=1',
    isWP: true },
  { title: 'Summer camp – part 3 (genetics)',
    author: 'Teni Anbarchian',
    date: 'August 1, 2017',
    category: 'Uncategorized',
    postURL: 'https://microcosmos.foldscope.com/?p=26540',
    imageURL: 'https://i1.wp.com/microcosmos.foldscope.com/wp-content/uploads/2017/08/IMG_0287.jpg?resize=960%2C640&ssl=1',
    isWP: true },
  { title: 'Summer Camp – part 2 (nutrition lesson)',
    author: 'Teni Anbarchian',
    date: 'August 1, 2017',
    category: 'Uncategorized',
    postURL: 'https://microcosmos.foldscope.com/?p=26535',
    imageURL: 'https://i0.wp.com/microcosmos.foldscope.com/wp-content/uploads/2017/08/IMG_9980.jpg?resize=288%2C480&ssl=1',
    isWP: true },
  { title: 'வண்ணத்துப்பூச்சியின் இறகு',
    author: 'Eden Educational Resource Centre',
    date: 'August 1, 2017',
    category: 'Uncategorized',
    postURL: 'https://microcosmos.foldscope.com/?p=26524',
    imageURL: 'https://i2.wp.com/microcosmos.foldscope.com/wp-content/uploads/2017/08/IMG_20170731_201958.jpg?resize=960%2C640&ssl=1',
    isWP: true },
  { title: 'Summer camp- part1',
    author: 'Teni Anbarchian',
    date: 'August 1, 2017',
    category: 'Uncategorized',
    postURL: 'https://microcosmos.foldscope.com/?p=26514',
    imageURL: 'https://i0.wp.com/microcosmos.foldscope.com/wp-content/uploads/2017/08/IMG_9859.jpg?resize=960%2C640&ssl=1',
    isWP: true },
  { title: 'The Spots on Ferns – SF Conservatory of Flowers, continued….',
    author: 'MaxCoyle',
    date: 'July 31, 2017',
    category: 'BiologyNature',
    postURL: 'https://microcosmos.foldscope.com/?p=26510',
    imageURL: 'https://i2.wp.com/microcosmos.foldscope.com/wp-content/uploads/2017/07/IMG_6405.jpg?resize=960%2C640&ssl=1',
    isWP: true },
  { title: 'Foldscope at the San Francisco Conservatory of Flowers!',
    author: 'MaxCoyle',
    date: 'July 31, 2017',
    category: 'BiologyNature',
    postURL: 'https://microcosmos.foldscope.com/?p=26498',
    imageURL: 'https://i0.wp.com/microcosmos.foldscope.com/wp-content/uploads/2017/07/IMG_6396.jpg?resize=960%2C640&ssl=1',
    isWP: true },
  { title: 'Mystery of floating jelly balls',
    author: 'Manu Prakash',
    date: 'July 28, 2017',
    category: 'Biology',
    postURL: 'https://microcosmos.foldscope.com/?p=26481',
    imageURL: 'No image available',
    isWP: true },
  { title: 'Using the simple sharpie dark-field setup to visualize C. elegans',
    author: 'gthh3',
    date: 'July 28, 2017',
    category: 'Uncategorized',
    postURL: 'https://microcosmos.foldscope.com/?p=26469',
    imageURL: 'No image available',
    isWP: true },
  { title: 'Sand Crabs and Shrimp at Stinson Beach, CA!',
    author: 'lila.neahring',
    date: 'July 27, 2017',
    category: 'BiologyNature',
    postURL: 'https://microcosmos.foldscope.com/?p=26454',
    imageURL: 'No image available',
    isWP: true },
  { title: 'Observing the yellow and reddish peel of the Apple.',
    author: 'Akshatha_Agastya',
    date: 'July 24, 2017',
    category: 'Uncategorized',
    postURL: 'https://microcosmos.foldscope.com/?p=26442',
    imageURL: 'https://i0.wp.com/microcosmos.foldscope.com/wp-content/uploads/2017/07/16336.jpg?resize=142%2C142&ssl=1',
    isWP: true },
  { title: 'வெங்காயத் தோல்',
    author: 'Eden Educational Resource Centre',
    date: 'July 23, 2017',
    category: 'Uncategorized',
    postURL: 'https://microcosmos.foldscope.com/?p=26432',
    imageURL: 'https://i2.wp.com/microcosmos.foldscope.com/wp-content/uploads/2017/07/IMG_20170722_144609.jpg?resize=960%2C640&ssl=1',
    isWP: true },
  { title: 'இனியனின் பதிவு',
    author: 'Eden Educational Resource Centre',
    date: 'July 22, 2017',
    category: 'Uncategorized',
    postURL: 'https://microcosmos.foldscope.com/?p=26421',
    imageURL: 'https://i1.wp.com/microcosmos.foldscope.com/wp-content/uploads/2017/07/IMG_20170722_142321.jpg?resize=960%2C640&ssl=1',
    isWP: true },
  { title: 'இனியனின் பதிவு – வண்ணத்துப்பூச்சி',
    author: 'Eden Educational Resource Centre',
    date: 'July 22, 2017',
    category: 'Uncategorized',
    postURL: 'https://microcosmos.foldscope.com/?p=26414',
    imageURL: 'https://i0.wp.com/microcosmos.foldscope.com/wp-content/uploads/2017/07/IMG_20170722_134454.jpg?resize=960%2C640&ssl=1',
    isWP: true },
  { title: 'comparison study of carrot and potato cells',
    author: 'Swapna_Agastya',
    date: 'July 21, 2017',
    category: 'Uncategorized',
    postURL: 'https://microcosmos.foldscope.com/?p=26402',
    imageURL: 'https://i0.wp.com/microcosmos.foldscope.com/wp-content/uploads/2017/07/IMG_20170713_123811.jpg?resize=960%2C640&ssl=1',
    isWP: true },
  { title: 'cells in beet root',
    author: 'Swapna_Agastya',
    date: 'July 21, 2017',
    category: 'Uncategorized',
    postURL: 'https://microcosmos.foldscope.com/?p=26284',
    imageURL: 'https://i0.wp.com/microcosmos.foldscope.com/wp-content/uploads/2017/07/IMG_20170713_122544.jpg?resize=960%2C640&ssl=1',
    isWP: true },
  { title: 'Quartz sand',
    author: 'JeffLange',
    date: 'July 20, 2017',
    category: 'ChemistryEnvironmentMaterialsNature',
    postURL: 'https://microcosmos.foldscope.com/?p=26383',
    imageURL: 'No image available',
    isWP: true },
  { title: 'The World Changers Foldscope Education Projects 2014 & 2017',
    author: 'twcproject',
    date: 'July 18, 2017',
    category: 'Uncategorized',
    postURL: 'https://microcosmos.foldscope.com/?p=26339',
    imageURL: 'https://i1.wp.com/microcosmos.foldscope.com/wp-content/uploads/2017/07/5.jpg?resize=960%2C640&ssl=1',
    isWP: true },
  { title: 'Head of a Stick ant from the Ecuadorian amazon',
    author: 'minxfuller',
    date: 'July 14, 2017',
    category: 'Uncategorized',
    postURL: 'https://microcosmos.foldscope.com/?p=26288',
    imageURL: 'https://i2.wp.com/microcosmos.foldscope.com/wp-content/uploads/2017/07/img_2625.jpg?resize=960%2C640&ssl=1',
    isWP: true },
  { title: 'curiosity to see cheek cells',
    author: 'Swapna_Agastya',
    date: 'July 10, 2017',
    category: 'Uncategorized',
    postURL: 'https://microcosmos.foldscope.com/?p=26264',
    imageURL: 'https://i0.wp.com/microcosmos.foldscope.com/wp-content/uploads/2017/07/IMG_20170710_140412.jpg?resize=960%2C640&ssl=1',
    isWP: true },
  { title: 'Foldscoping from a boat – hello from NZ',
    author: 'Manu Prakash',
    date: 'July 7, 2017',
    category: 'Biology',
    postURL: 'https://microcosmos.foldscope.com/?p=26251',
    imageURL: 'https://i0.wp.com/microcosmos.foldscope.com/wp-content/uploads/2017/07/img_0822-1.jpg?resize=960%2C640&ssl=1',
    isWP: true },
  { title: 'Our Latex experiments',
    author: 'laksiyer',
    date: 'July 4, 2017',
    category: 'BiologyMaterialsNature',
    postURL: 'https://microcosmos.foldscope.com/?p=26210',
    imageURL: 'https://i2.wp.com/microcosmos.foldscope.com/wp-content/uploads/2017/07/IMG_20170627_230404.jpg?resize=960%2C640&ssl=1',
    isWP: true },
  { title: 'First grains of sand',
    author: 'lombardfa',
    date: 'July 4, 2017',
    category: 'Uncategorized',
    postURL: 'https://microcosmos.foldscope.com/?p=26204',
    imageURL: 'https://i0.wp.com/microcosmos.foldscope.com/wp-content/uploads/2017/07/IMG_1190.jpg?resize=960%2C640&ssl=1',
    isWP: true },
  { title: 'Fast moving creatures in the water collected in a Bromeliad in the cloud forest',
    author: 'minxfuller',
    date: 'July 2, 2017',
    category: 'Uncategorized',
    postURL: 'https://microcosmos.foldscope.com/?p=26196',
    imageURL: 'https://i2.wp.com/microcosmos.foldscope.com/wp-content/uploads/2017/07/img_2302.jpg?resize=960%2C640&ssl=1',
    isWP: true },
  { title: 'It’s on!',
    author: 'iyerbiswas',
    date: 'July 1, 2017',
    category: 'Uncategorized',
    postURL: 'https://microcosmos.foldscope.com/?p=26193',
    imageURL: 'https://i1.wp.com/microcosmos.foldscope.com/wp-content/uploads/2017/07/PetalMeetsLeaf.png?resize=960%2C640&ssl=1',
    isWP: true },
  { title: 'Microscope in an envelope, so many possibilities!',
    author: 'iyerbiswas',
    date: 'June 29, 2017',
    category: 'Uncategorized',
    postURL: 'https://microcosmos.foldscope.com/?p=26187',
    imageURL: 'https://i1.wp.com/microcosmos.foldscope.com/wp-content/uploads/2017/06/magic.jpg?resize=960%2C640&ssl=1',
    isWP: true };
    db.collection("posts").insertOne(postData, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new contact.");
    } else {
      res.status(201).json(doc.ops);
    }
  });
  // scrapeFeed(res);
});

//route to handle iOS post request
app.post('/', function(req,res){
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
