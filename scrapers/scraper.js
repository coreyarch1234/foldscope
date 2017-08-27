//request to merge HTTP and HTTPS
var request = require("request");
//cheerio to work with downloaded web data using jquery on the server
cheerio = require("cheerio");
var groupURL = "https://microcosmos.foldscope.com/";

var arrayURLS = [];
var allFeed = [];
var isDone = false;



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
            console.log("allFeed is done");
            isDone = true;
            console.log(isDone);
            return newsFeed;
        }else{
            console.log("An error occurred with scraping");
        }
    });
}

function something(callback){
    callback(groupURL);
}

module.exports = function(res){
    something(function(groupURL) {
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
                isDone = true;
                console.log(allFeed);
                return newsFeed;
            }else{
                console.log("An error occurred with scraping");
            }
        });
    })
    // let createGroup = function(){
    //     return new Promise(function(resolve, reject, callback){
    //         // postScrape(groupURL);
    //         // while (isDone == false){
    //         //     console.log("still scraping");
    //         //     console.log(isDone);
    //         // }
    //         // resolve(allFeed);
    //         callback(url);
    //     })
    // }
    // createGroup().then(function(result){
    //     console.log("the scraping has finished and here is allFeed: ");
    //     console.log(allFeed);
    // })
    // postScrape(groupURL);
    // let createIndividual = function(feed){
    //     return new Promise(function(resolve, reject){
    //         var i = 0;
    //         // console.log(allJSONInfo)
    //         feed = feed.filter(function(elem, pos) {
    //             return feed.indexOf(elem) == pos;
    //         })
            // console.log(feed);
    //         // console.log(feed.length);
    //         var requestLoop = setInterval(function(){
    //             if (i == feed.length){
    //                 console.log(allJSONInfo)
    //                 //convert to json
    //                 // finalJSON = {};
    //                 // for (i=0; i<allJSONInfo.length; i++){
    //                 //     var key = allJSONInfo[i].title;
    //                 //     finalJSON[key] = allJSONInfo[i];
    //                 // }
    //                 // console.log("finalJSON ---------");
    //                 // console.log(finalJSON)
    //                 resolve(allJSONInfo);
    //                 clearInterval(requestLoop);
    //             }else{
    //                 getJSONInfo(feed[i]);
    //             }
    //             i++;
    //       }, 3000);
    //     })
    // }

    // //This will be on a timer per month
    // createGroup().then(function(result){
    //     createIndividual(allFeed[0].arrayURLS).then(function(postData){
    //         //Check how many WP posts to determine whether to populate
    //         // Post.count({isWP: true}, function(err, count){
    //         //     console.log("the count is: " + count);
    //         //     if (count > 0){
    //         //         console.log("there is no need to save posts")
    //         //     }else{
    //         //         // We want to populate Post model with an array of json posts
    //         //         Post.create(postData, function(err, results){
    //         //             if (err) {
    //         //                 console.log("there was an error saving to post model");
    //         //             }else{
    //         //                 console.log("posts created and save successfully");
    //         //                 console.log(results);
    //         //             }
    //         //         })
    //         //     }
    //         // })
    //         db.collection("posts").insertOne(postData, function(err, doc) {
    //         if (err) {
    //           handleError(res, err.message, "Failed to create new contact.");
    //         } else {
    //         //   res.status(201).json(doc.ops[0]);
    //         //   res.json(db.collection("posts").find())
    //         }
    //       });
    //       res.json(db.collection("posts").find())
    //     })
    // })
}
