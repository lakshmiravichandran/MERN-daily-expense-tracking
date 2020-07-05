// Soundarya - Admin model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");
var User = mongoose.model("user");
const SALT_FACTOR = 10;

// Data model for admin
const AdminSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    created: { type: Date, default: Date.now }
  },
  { collection: "admin" }
);

var noop = function() {};
AdminSchema.pre("save", function(done) {
  var user = this;
  if (!user.isModified("password")) {
    return done();
  }
  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) {
      return done(err);
    }
    bcrypt.hash(user.password, salt, noop, function(err, hashedPassword) {
      if (err) {
        return done(err);
      }
      user.password = hashedPassword;
      done();
    });
  });
});

// checking password function
AdminSchema.methods.checkPassword = function(guess, done) {
  bcrypt.compare(guess, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};



// Export model
module.exports = mongoose.model("admin", AdminSchema);
