const mongoose = require("mongoose")
const tokenSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "user",
  },
  token: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    require: true,
  },
  expiresAt: {
    type: Date,
    require: true,
  },
})
const Token = mongoose.model("Token", tokenSchema)
module.exports = Token
