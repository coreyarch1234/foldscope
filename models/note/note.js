var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//Will contain a name and a game code along with a question array.
var NoteSchema = new Schema({
  createdAt            : { type: Date, default: Date() },
  updatedAt            : { type: Date, default: Date() },
  title                : { type: String, unique: false, required: false },
  author               : { type: String, unique: false, required: true },
  category             : { type: String, unique: false, required: false },
  date                 : { type: String, unique: false, required: true },
  formatDate           : { type: String, unique: false, required: true },
  postURL              : { type: String, unique: true, required: false },
  imageURL             : { type: String, unique: false, required: false },
  description          : { type: String, unique: false, required: false },
  order_ID             : { type: Number, unique: true, required: false },
  isWP                 : { type: Boolean, unique: false, required: true }
});

module.exports = mongoose.model('Note', NoteSchema);
