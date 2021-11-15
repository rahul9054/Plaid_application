const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  // access_token:{
  //  type: String,
   
  // }
});

module.exports = new mongoose.model("User", UserSchema);
