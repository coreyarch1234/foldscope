//
//  MovieService.swift
//  move_json
//
//  Created by Marquavious on 7/14/17.
//  Copyright © 2017 Marquavious Draggon. All rights reserved.
//

import Foundation
import SwiftyJSON
import Alamofire

typealias MovieJSON = [String:Any]


struct test{

    static func hitApi(){

        let params = ["name":"marquavious"]

       Alamofire.request("http://localhost:3000/", method: .post, parameters: params)
    }
}


struct MovieService {

    // This function grabs the movie objects from the API and completes
    // With an array of Created Movie Objects

    static func getMovies(completion: @escaping ([Movie]) -> ()){
        var arrayOfMovies: [Movie] = [] // Temp Array

        // Use Alamofire to hit the api and it returns a response in JSON format
        Alamofire.request(Constants.itunesUrl).responseJSON { (response) in

            // Cast the response into a SwiftyJSON Object
            var json = JSON(response.data as Any)

            // Goes to the feed branch, then the entry branch
            let feed = json["feed"]["entry"].arrayValue

            // Iterats through objects in feed
             for movie in feed {
                if let newMovie = Movie(movie){ // Creates new movie
                    arrayOfMovies.append(newMovie) // Adds movie to the array
                }
            }
            completion(arrayOfMovies) // Completion completes with the arrayOfMovies
        }
    }

    // This function grabs the movie objects from the API and completes
    // With an array of Created Movie Objects
    // Without alamofire and SwiftyJSON

    static func getMoviesManually(completion: @escaping (Error?,[Movie]) -> ()){

        // Temprary Array of movies
        var tempArray = [Movie]()

        // Create a url object
        let unwrappedUrl = URL(string: Constants.itunesUrl)

        // Make sure there is a url
        guard let url = unwrappedUrl else {return}

        // Replacing Alamofire
        URLSession.shared.dataTask(with: url) { (data, response, error) in

            // Checking for errors
            if error != nil {

                // If there is an error
                return completion(error,[])
            }

            // Make sure there is a json
            guard let unwrappedJson = data else {return}

            // Create a JSON object out of the data
            do {
                // JSONSerialization is the same as doing "JSON(data)" with SwiftyJSON
                if let json = try? JSONSerialization.jsonObject(with: unwrappedJson) as! MovieJSON {

                    // Creates a feed object then it creates an entries object from
                    guard let feed = json["feed"] as? MovieJSON, let entries = feed["entry"] as? [MovieJSON] else { return }

                    // Loop through entries
                    for movie in entries {

                        // Passing JSON through the Movie init
                        if let movie = Movie(movie){
                            // Add movie to the tempArray array
                            tempArray.append(movie)
                        }
                    }
                }
            }

            // We have to add this code below because networking is done on a differnt thread
            // This puts the operatoin on the main thread.
            DispatchQueue.main.async {
                completion(nil,tempArray)
            }
            // We have to resume at the end of a URLSession for it to run
        }.resume()
    }
}
