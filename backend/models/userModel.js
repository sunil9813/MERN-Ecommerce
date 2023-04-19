const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please add a name"],
  },
  email: {
    type: String,
    require: [true, "Please add a email"],
    unique: true,
    trim: true,
    match: [/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/, "Please enter a valid email"],
  },
  password: {
    type: String,
    require: [true, "Please add a password"],
    minLength: [8, "Password must be up to 8 characters"],
    // maxLength: [20, "Password should not be more than 20 characters"],
  },
  photo: {
    type: String,
    require: [true, "Please add a photo"],
    default: "https://cdn-icons-png.flaticon.com/512/2202/2202112.png",
  },
  phone: {
    type: String,
    default: "+977 ",
  },
  bio: {
    type: String,
    default: "Hi",
    maxLength: [200, "Bio should not be more than 200 characters"],
  },
}, {
  timestamps: true
})

//Step 2 : Encrypt password before saving to DB
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next()
  }
  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(this.password, salt)
  this.password = hashedPassword
  next()
})
const User = mongoose.model("User", userSchema)
module.exports = User