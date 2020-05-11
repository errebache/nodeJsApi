const  mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName : {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    birthday: {
        type:Date,
        required: true,
        default: new Date()
    },
    username:{
      type: String,
      required: true
    },
    password:{
        type: String,
        required:true
    },
    pictureUrl:{
        type: String,
        required:true
    }
});

const User = module.exports = mongoose.model('User',UserSchema);

module.exports.getUserById = (id,callback) => {
 User.findById(id,callback);
}

module.exports.getUserByUsername = (username,callback) => {
  const query = {username: username}
  User.findOne(query,callback);
}

module.exports.addUser = (newUser,callback) => {
  bcrypt.genSalt(10,(err,salt) => {
     bcrypt.hash(newUser.password,salt,(err,hash) => {
         if(err) throw err;
         newUser.password = hash;
         newUser.save(callback);
     })
  })
}

module.exports.comparePassword = (condidatePassword,hash,callback) => {
  bcrypt.compare(condidatePassword,hash,(err,isMatch) => {
      if(err) throw err;
      callback(null,isMatch);
  })
}
			



