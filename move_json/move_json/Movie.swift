//
//  Movie.swift
//  move_json
//
//  Created by Marquavious on 7/14/17.
//  Copyright © 2017 Marquavious Draggon. All rights reserved.
//

import Foundation
import SwiftyJSON

class Movie {
    
    var title: String?
    var author: String?
    
    /*
     The int takes in json and parses it for us.
     After that, it sets the values for us.
     If any of the values return nil, the
     object will not be created!
     
     This init is special because it checks
     The type of json we inter. So if it's SwiftyJSON,
     It will run one init. If it's our custom MovieJSON,
     It will run the other
     */
    
    init?(_ json: Any){
        
        // If it is of type JSON
        if json is JSON{
            let json = JSON(json)
            guard let title = json["title"]["label"].string,
                let author = json["im:artist"]["label"].string
                else { return nil }
            self.title = title
            self.author = author
            
        // If it is of type MovieJSON
        } else if json is MovieJSON {
            if let json = json as? MovieJSON {
                guard let titleNode = json["im:name"] as? MovieJSON,
                    let title = titleNode["label"] as? String,
                    let authorNode = json["im:artist"] as? MovieJSON,
                    let author = authorNode["label"] as? String
                    else { return nil }
                self.title = title
                self.author = author
            }
            
        // If it's neither
        } else {
            return nil
        }
    }
}
