const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = mongoose.Schema({
  image: { type: String },
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  Gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  Accounttype: { type: String },
  Accountnum: { type: String, unique: true },
  AccountBalance: { type: Number },
  recentTransaction: [
    {
      transferAmount: Number,
      ban: String,
      transactype: Boolean,
      userImage: String,
    },
  ],
  wallets: [{ walletName: String, Amount: Number }],
});
let saltRound = 10;
userSchema.pre("save", function (next) {
  bcrypt.hash(this.password, saltRound, (err, hashedPassword) => {
    if (!err) {
      this.password = hashedPassword;
      next();
    }
  });
});
userSchema.methods.validatePassword = function (password, callback) {
  bcrypt.compare(password, this.password, (err, same) => {
    if (!err) {
      callback(err, same);
    } else {
      next();
    }
  });
};
const userModel = mongoose.model("allusers", userSchema);

module.exports = userModel;
