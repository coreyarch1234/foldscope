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
