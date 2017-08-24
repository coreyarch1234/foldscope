//request to merge HTTP and HTTPS
var request = require("request");
//cheerio to work with downloaded web data using jquery on the server
cheerio = require("cheerio");

//Post Model
var Post = require('../models/post/post');

//web page to scrape
var url = "https://microcosmos.foldscope.com/?p=26017";
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

module.exports = function(res){
    let createGroup = function(){
        return new Promise(function(resolve, reject){
            y = 0;
            var requestLoopGroup = setInterval(function(){
                if (y == 1){
                    // console.log("resolving and y is: " + y);
                    resolve(allFeed);
                    clearInterval(requestLoopGroup);
                }else{
                    console.log("about to post scrape");
                    postScrape(groupURL);
                }
                y++;
          }, 3000);
        })
    }
    let createIndividual = function(feed){
        return new Promise(function(resolve, reject){
            var i = 0;
            // console.log(allJSONInfo)
            feed = feed.filter(function(elem, pos) {
                return feed.indexOf(elem) == pos;
            })
            // console.log(feed);
            // console.log(feed.length);
            var requestLoop = setInterval(function(){
                if (i == feed.length){
                    console.log(allJSONInfo)
                    //convert to json
                    // finalJSON = {};
                    // for (i=0; i<allJSONInfo.length; i++){
                    //     var key = allJSONInfo[i].title;
                    //     finalJSON[key] = allJSONInfo[i];
                    // }
                    // console.log("finalJSON ---------");
                    // console.log(finalJSON)
                    resolve(allJSONInfo);
                    clearInterval(requestLoop);
                }else{
                    getJSONInfo(feed[i]);
                }
                i++;
          }, 3000);
        })
    }

    //This will be on a timer per month
    createGroup().then(function(result){
        createIndividual(allFeed[0].arrayURLS).then(function(postData){
            //Check how many WP posts to determine whether to populate
            // Post.count({isWP: true}, function(err, count){
            //     console.log("the count is: " + count);
            //     if (count > 0){
            //         console.log("there is no need to save posts")
            //     }else{
            //         // We want to populate Post model with an array of json posts
            //         Post.create(postData, function(err, results){
            //             if (err) {
            //                 console.log("there was an error saving to post model");
            //             }else{
            //                 console.log("posts created and save successfully");
            //                 console.log(results);
            //             }
            //         })
            //     }
            // })
            db.collection("posts").insertOne(postData, function(err, doc) {
            if (err) {
              handleError(res, err.message, "Failed to create new contact.");
            } else {
            //   res.status(201).json(doc.ops[0]);
            //   res.json(db.collection("posts").find())
            }
          });
          res.json(db.collection("posts").find())
        })
    })
}
