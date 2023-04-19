const express = require("express")
const router = express.Router()
const { registerUser, loginUser, logoutUser, getUser, loginStatus, updateUser, changePassword, forgetPassword, resetPassword } = require("../controllers/userController")
const protect = require("../middleWare/authMiddleWare")

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logout", logoutUser)
router.get("/getuser", protect, getUser)
router.get("/loggedin", loginStatus)
router.patch("/updateuser", protect, updateUser)
router.patch("/changepassword", protect, changePassword)
router.post("/forgetpassword", forgetPassword)
router.put("/resetpassword/:resetToken", resetPassword)

/*
PUT =>  is a method of modifying resource where the client sends data that updates the entire resource . 
PATCH => is a method of modifying resources where the client sends partial data that is to be updated without modifying the entire data.
*/
module.exports = router
