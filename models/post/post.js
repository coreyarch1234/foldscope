var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//Will contain a name and a game code along with a question array.
var PostSchema = new Schema({
  createdAt            : { type: Date, default: Date() },
  updatedAt            : { type: Date, default: Date() },
  title                : { type: String, unique: true, required: true },
  author               : { type: String, unique: true, required: true },
  category             : { type: String, unique: true, required: true },
  date                 : { type: String, unique: true, required: true },
  postURL              : { type: String, unique: true, required: false },
  imageURL             : { type: String, unique: true, required: false },
  isWP                 : { type: Boolean, unique: false, required: true }

});

module.exports = mongoose.model('Post', PostSchema);
