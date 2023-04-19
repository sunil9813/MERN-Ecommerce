const expressAsyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

const protect = expressAsyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token

    if (!token) {
      res.status(401)
      throw new Error("Not authorized, Please Login")
    }

    // verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET)

    // Get user id form token
    const user = await User.findById(verified.id).select("-password")

    if (!user) {
      res.status(401)
      throw new Error("User not found")
    }
    req.user = user
    next()
  } catch (error) {
    res.status(401)
    throw new Error("Not authorized, Please Login")
  }
})
module.exports = protect
