const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const Token = require("../models/tokenModel")
const crypto = require("crypto")
const sendEmail = require("../utils/sendEmail")

/*asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    console.log(error)
  }
})*/

// step : 2
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

// Register User
const registerUser = asyncHandler(async (req, res) => {
  //res.send("Register  User")
  const { name, email, password } = req.body

  // Validation
  if (!name || !email || !password) {
    res.status(400)
    throw new Error("Please fill in all required fileds")
  }

  if (password.length < 8) {
    res.status(400)
    throw new Error("Password must be upto 8 characters")
  }

  // check if user email is already exit
  const userExits = await User.findOne({ email })
  if (userExits) {
    res.status(400)
    throw new Error("Email is already exit")
  }

  //create new user
  const user = await User.create({
    name,
    email,
    password,
  })

  // step : 2  Generate Token
  const token = generateToken(user._id)
  //send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  })

  if (user) {
    const { _id, name, email, photo, phone, bio } = user
    res.status(201).json({ _id, name, email, photo, phone, bio, token })
  } else {
    res.status(400)
    throw new Error("Invalid user data")
  }
})

// LogIn User
const loginUser = asyncHandler(async (req, res) => {
  //res.send("Login User")
  const { email, password } = req.body

  // Validate Request
  if (!email || !password) {
    res.status(400)
    throw new Error("Please add Email and Password")
  }
  // Check if user exits
  const user = await User.findOne({ email })
  if (!user) {
    res.status(400)
    throw new Error("User not found, Please signUp")
  }

  // User Exits , check if password is correct
  const passwordIsCorrrect = await bcrypt.compare(password, user.password)

  //  Generate Token
  const token = generateToken(user._id)
  //send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  })

  if (user && passwordIsCorrrect) {
    const { _id, name, email, photo, phone, bio } = user
    res.status(201).json({ _id, name, email, photo, phone, bio, token })
  } else {
    res.status(400)
    throw new Error("Invalid email or password")
  }
})

// logout
const logoutUser = asyncHandler(async (req, res) => {
  //res.send("logout out")

  //send HTTP-only cookie
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  })
  return res.status(200).json({ message: "Successfully Logged Out" })
})

// get user
const getUser = asyncHandler(async (req, res) => {
  //res.send("Get user data")
  const user = await User.findById(req.user._id)

  if (user) {
    const { _id, name, email, photo, phone, bio } = user
    res.status(200).json({ _id, name, email, photo, phone, bio })
  } else {
    res.status(400)
    throw new Error("User not found")
  }
})

const loginStatus = asyncHandler(async (req, res) => {
  //res.send("loggend")

  const token = req.cookies.token
  if (!token) {
    return res.json(false)
  }
  // verify token
  const verified = jwt.verify(token, process.env.JWT_SECRET)
  if (verified) {
    return res.json(true)
  }
  return res.json(false)
})

const updateUser = asyncHandler(async (req, res) => {
  //res.send("User Updated")
  const user = await User.findById(req.user._id)

  if (user) {
    const { name, email, photo, phone, bio } = user
    user.email = email
    user.name = req.body.name || name
    user.phone = req.body.phone || phone
    user.bio = req.body.bio || bio
    user.photo = req.body.photo || photo

    const updatedUser = await user.save()
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      photo: updatedUser.photo,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
    })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

const changePassword = asyncHandler(async (req, res) => {
  //res.send("User password change")
  const user = await User.findById(req.user._id)
  const { oldPassword, password } = req.body

  if (!user) {
    res.status(400)
    throw new Error("User not found, Please signup")
  }
  // validate
  if (!oldPassword || !password) {
    res.status(400)
    throw new Error("Please add old and new password")
  }
  // check if oldPassword match password in DB
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password)

  // save new password
  if (user && passwordIsCorrect) {
    user.password = password
    await user.save()
    res.status(200).send("Password Change Successful")
  } else {
    res.status(400)
    throw new Error("Old Password is incorrect")
  }
})

/* 
// Forgot Password Processes
#1. User clicks on Forgot Password
#2. Create a reset token (string) and save in our database
#3. Send reset token to user email in the form of a link
#4. When User clicks the link, compare the reset token in the link with that saved in the database
#5. If they match, change reset the user's Password 

// Forgot Password Steps
#1. Create forgot Password route
#2. Create Token Model
#3. Create Email Sender function
#4. Create controller function  
*/

const forgetPassword = asyncHandler(async (req, res) => {
  //res.send("Forget Password")
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    res.status(404)
    throw new Error("User does not exits")
  }
  //delete token if it exits in DB
  let token = await Token.findOne({ userId: user._id })
  if (token) {
    await token.deleteOne()
  }

  //create reset token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id
  console.log(resetToken)

  // hash token before saving to DB
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  //console.log(hashedToken)
  //console.log(resetToken)

  //save Token to DB
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), // 30 Min
  }).save()

  // Construct Rest URl
  const resetUrl = `${process.env.FRONT_END_URL}/resetpassword/${resetToken}`

  // Reset Email
  const message = `
  <h2>Hello ${user.name}</h2>
  <p>Please use the url below to reset your password</p>
  <p>This reset link is valid for only for 30 Minutes.</p>
  <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
  <p>Regards...</p>
  <p>GorkCoder Team </p>
  `
  const subject = "Password Reset Request"
  const send_to = user.email
  const send_from = process.env.EMAIL_USER

  try {
    await sendEmail(subject, message, send_to, send_from)
    res.status(200).json({ success: true, message: "Rest Email is Send" })
  } catch (error) {
    res.status(500)
    throw new Error("Email not sent, please try again")
  }
})

const resetPassword = asyncHandler(async (req, res) => {
  //res.send("Forget Password")
  const { password } = req.body
  const { resetToken } = req.params

  // hash token  , then compare to token in DB
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  //find token in DB
  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  })
  if (!userToken) {
    res.status(404)
    throw new Error("invalid or Expired Token")
  }

  // find user
  const user = await User.findOne({ _id: userToken.userId })
  user.password = password
  await user.save()
  res.status(200).json({ message: "Password reset successful, Please Login" })
})

//const logoutUser = asyncHandler(async (req, res) => {})

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgetPassword,
  resetPassword,
}
