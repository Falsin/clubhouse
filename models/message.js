const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    title: {type: String, required: true, maxlength: 100},
    time: {type: Date, required: true},
    text: {type: String, required: true, maxlength: 100},
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true}
  }
)

module.exports = mongoose.model('Message', MessageSchema)