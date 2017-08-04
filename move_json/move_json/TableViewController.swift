//
//  TableViewController.swift
//  move_json
//
//  Created by Marquavious on 7/14/17.
//  Copyright © 2017 Marquavious Draggon. All rights reserved.
//

import UIKit

class TableViewController: UITableViewController {
    
    // Array of movies to display on tableview
    var arrayOfMovies:[Movie] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()

        MovieService.getMovies { (moviesFromBackend) in
            
            // Set the classes array of movies with 
            // The movies we grabbed from the backend
            // The reload the tableview
            // self.arrayOfMovies = moviesFromBackend
             // self.tableView.reloadData()
            print(moviesFromBackend.count)
        }
        
        MovieService.getMoviesManually { (error, movies) in
        
            // IF ERROR
            if let error = error {
                print(error)
                return
            }
            
            // Set the classes array of movies with
            // The movies we grabbed from the backend
            // The reload the tableview
            // self.arrayOfMovies = movies
            
            self.arrayOfMovies = movies
            self.tableView.reloadData()
        }
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return arrayOfMovies.count //return the count of the array
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        // Create a cell and downcast it as a MovieTableViewCell
        let cell = tableView.dequeueReusableCell(withIdentifier: "movieCell", for: indexPath) as! MovieTableViewCell
        
        // Grab movie from array
        let movie = arrayOfMovies[indexPath.row]
        
        // Set the title and artist lables
        cell.titleLabel.text = movie.title
        cell.artistLabel.text = movie.author
        
        return cell
    }
    
}
