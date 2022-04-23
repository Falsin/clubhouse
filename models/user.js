const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: {type: String, required: true, maxlength: 100},
    lastName: {type: String, required: true, maxLength: 100},
    username: {type: String, required: true, maxlength: 100},
    password: {type: String, required: true}
  }
)

module.exports = mongoose.model('User', UserSchema)