const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        require: true
    },
    password:{
        type:String
    }
})

const User = mongoose.model('User',UserSchema);

module.exports = User;
module.exports.hashPassword = async (password) => {
    try {
      const salt = await bcrypt.genSalt(10)
      return await bcrypt.hash(password, salt)
     
    } catch(error) {
      throw new Error('Hashing failed', error)
    }
  }