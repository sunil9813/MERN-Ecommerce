import axios from "axios"
import { toast } from "react-toastify"

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

// step 2 :
export const validateEmail = (email) => {
  return email.match(/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/)
}

export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/api/users/register`, userData, { withCredentials: true })
    toast.success("User Registered Successfully")
    return res.data
  } catch (error) {
    // this are possible error format
    // this is exact  method to pick error from backend
    const message = (error.res && error.res.data && error.res.data.message) || error.message || error.toString()
    toast.error(message)
  }
}

// login User
export const loginUser = async (userData) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/api/users/login`, userData)
    toast.success("Login Successfully...")
    return res.data
  } catch (error) {
    const message = (error.res && error.res.data && error.res.data.message) || error.message || error.toString()
    toast.error(message)
  }
}
// logout User
export const logoutUser = async () => {
  try {
    await axios.get(`${BACKEND_URL}/api/users/logout`)
    toast.success("Logout Successfully...")
  } catch (error) {
    const message = (error.res && error.res.data && error.res.data.message) || error.message || error.toString()
    toast.error(message)
  }
}
// forget password
export const forgetPassword = async (userData) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/api/users/forgetpassword`, userData)
    toast.success(res.data.message)
  } catch (error) {
    const message = (error.res && error.res.data && error.res.data.message) || error.message || error.toString()
    toast.error(message)
  }
}

// reset password
export const resetPassword = async (userData, resetToken) => {
  try {
    const res = await axios.put(`${BACKEND_URL}/api/users/resetpassword/${resetToken}`, userData)
    toast.success(res.data.message)
    return res.data
  } catch (error) {
    const message = (error.res && error.res.data && error.res.data.message) || error.message || error.toString()
    toast.error(message)
  }
}

// get login status
// yadi page reload bhayo hami le sabai data loss garxa except redux fun
// to prevent this
export const getLoginStatus = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/users/loggedin`)
    return res.data
  } catch (error) {
    const message = (error.res && error.res.data && error.res.data.message) || error.message || error.toString()
    toast.error(message)
  }
}

//Get user Profile
export const getUser = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/users/getuser`)
    return res.data
  } catch (error) {
    const message = (error.res && error.res.data && error.res.data.message) || error.message || error.toString()
    toast.error(message)
  }
}

//Upadate Profile
export const updateUser = async (formData) => {
  try {
    const res = await axios.patch(`${BACKEND_URL}/api/users/updateuser`, formData)
    return res.data
  } catch (error) {
    const message = (error.res && error.res.data && error.res.data.message) || error.message || error.toString()
    toast.error(message)
  }
}
//Change Password
export const changePassword = async (formData) => {
  try {
    const res = await axios.patch(`${BACKEND_URL}/api/users/changepassword`, formData)
    return res.data
  } catch (error) {
    const message = (error.res && error.res.data && error.res.data.message) || error.message || error.toString()
    toast.error(message)
  }
}
