For scrapers:
1) Create function that takes a URL (will have to be all of the months) of WP Posts and
    a) Finds the URL of each post and pushes them to an array
    b) It returns the array
2) Create a function that takes a URL and finds the essential info for a WP Post for mobile
    a) Title, Author, Category, Date, WordPressURL and MainHeaderImageURL
    b) It returns the JSON
3) In controller file
    a) Have a basic post route, where a function loops through every URL that the first function returns and pass those URLs into the second function to get the essential JSON info.
    b) Appends each returned JSON into an array that you will send as a response

Post Model WP:

0) Convert scraping routes to functions to put them in a new file. Call them in server with URLs.

1) Create post model with:
    a) Title - String
    b) Author - String
    c) Category - String
    d) Date - String
    e) PostURL - String (="None" for user posts)
    f) ImageURL - String (="None" for user posts)
    g) isWP - Boolean (= True for wordpress posts and False for user posts)

2) Go to scraping functions and loop through array to populate Post Model with each post

3) Create post route for iOS request. Query Post model and return posts in json


How to save all posts to DB automatically

Create a function that takes in the latest date (month/day/year) and the first date.
The function will make the latest day the initial and the first date the final. It will create a link starting with the initial. The link is: "https://microcosmos.foldscope.com/?m=YYYYMM&paged=Count".
This includes the date and the page count. It will call the groupURL function and store the first page links in a variable and then check if any of those links exist. It will create posts for the ones that don't exist. Once it finds one that does exist, it will stop there.

There is no need to continue Since all of the posts will have been stored in the DB in order. It doesn't matter if the posts are in order in the DB, just as long as we find a post that is equal to whatever post we are on.

If there are no posts in that groupURL, we increment the page. We continue this until one of these links returns a 404. Once it does, we go down a date and continue the process. Once the DB is empty, this will fill up the DB with all of the posts since none exist. From initial to end. 
