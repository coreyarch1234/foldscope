// Create a function that takes a URL and finds the essential info for a WP Post for mobile
//     a) Title, Author, Category, Date, WordPressURL and MainHeaderImageURL
//     b) It returns the JSON
//request to merge HTTP and HTTPS
var request = require("request");
//cheerio to work with downloaded web data using jquery on the server
cheerio = require("cheerio");
allURLSData = []

module.exports = function(url) {
    // //make a request to web page to scrape
    console.log("data added")
    console.log(allURLSData)
    request(url, function(error, response, body){
        if (!error){
            var $ = cheerio.load(body);
            var blogText = $.text();
            var blogHTML = $.html();

            //Title
            var title = $('h1.entry-title').text().trim();
            console.log("The title is")
            console.log(title);

            //Author
            var author = $('span.author').text();

            //Date
            var date = $('time.entry-date').text();

            //Category
            var category = $("[rel='category']").text();

            //url
            var wordPressURL = url;

            //main header image
            var headerImageURL = $('div.entry-media-thumb').css('background-image');
            headerImageURL = headerImageURL.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');


            newsFeed = {
                title: title,
                author: author,
                date: date,
                category: category,
                wordPressURL: wordPressURL,
                headerImageURL: headerImageURL
            }
            allURLSData.push(newsFeed);
            // res.json(newsFeed);
            console.log(newsFeed)
            return newsFeed;
        }else{
            console.log("An error occurred with scraping");
        }
    });
}
