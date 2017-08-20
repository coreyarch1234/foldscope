// Create function that takes a URL (will have to be all of the months) of WP Posts and
//     a) Finds the URL of each post and pushes them to an array
//     b) It returns the array
//request to merge HTTP and HTTPS
var request = require("request");
//cheerio to work with downloaded web data using jquery on the server
cheerio = require("cheerio");

var urlScraper = require('../scrapers/url-scraper');

module.exports = function(url) {
    // //make a request to web page to scrape
    request(url, function(error, response, body){
        if (!error){
            var $ = cheerio.load(body);
            //find all urls
            var wordPressURLSet = url;
            // console.log(wordPressURLSet);
            var wordPressURLReg = /(https:\/\/microcosmos.foldscope.com\/\?p=\d+)/;
            var link = "";
            var arrayURLS = [];
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
            // urlScraper(arrayURLS[10]);
            // urlScraper(arrayURLS[12]);
            // urlScraper(arrayURLS[18]);
            // urlScraper(arrayURLS[19]);
            // res.json(newsFeed);
            // console.log(newsFeed);
            // var newsFeedOne = urlScraper(arrayURLS[10]);
            // console.log(newsFeedOne);
            return newsFeed;
        }else{
            console.log("An error occurred with scraping");
        }
    });
}
