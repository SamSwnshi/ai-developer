import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    select: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: [6, "Email must be at least 6 Character long"],
    maxLength: [50, "Email must be at least 50 Character long"],
  },
});

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

userSchema.method.isValidPassword = async function (password) {
  console.log(password, this.password);
  return await bcrypt.compare(password, this.password);
};

userSchema.method.generateJWT = function () {
  return jwt.sign({ email: this.email }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

const User = mongoose.model("user", userSchema);

export default User;
