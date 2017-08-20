var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//Will contain a name and a game code along with a question array.
var PostSchema = new Schema({
  createdAt            : { type: Date, default: Date() },
  updatedAt            : { type: Date, default: Date() },
  title                : { type: String, unique: false, required: true },
  author               : { type: String, unique: false, required: true },
  category             : { type: String, unique: false, required: true },
  date                 : { type: String, unique: false, required: true },
  postURL              : { type: String, unique: false, required: false },
  imageURL             : { type: String, unique: false, required: false }
});

module.exports = mongoose.model('Post', PostSchema);
