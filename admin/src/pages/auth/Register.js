import React, { useState } from "react"
import styles from "./auth.module.scss"
import { TiUserAddOutline } from "react-icons/ti"
import Card from "../../components/card/Card"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { registerUser, validateEmail } from "../../services/authServices"
import { useDispatch } from "react-redux"
import { SET_LOGIN, SET_NAME } from "../../redux/auth/authSlice"
import Loader from "../../components/loader/Loader"

// what are think that we need in frontend
// but password_conform doesnt fetch from backend
const initialState = {
  name: "",
  email: "",
  password: "",
  password_confirm: "",
}
const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialState)
  const [isLoading, setIsLoading] = useState(false) // to monitor loading

  const { name, email, password, password_confirm } = formData

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData, // prev value in form
      [name]: value,
    })
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    //validation in frontend
    if (!name || !email || !password) {
      return toast.error("All fields are required")
    }

    // what if password1 doesn't match to password_confirm
    if (password !== password_confirm) {
      return toast.error("Password do not match")
    }

    if (password.length < 8) {
      return toast.error("Password must be 8 characters")
    }

    if (!validateEmail(email)) {
      return toast.error("Please enter valid email")
    }

    const userData = {
      name,
      email,
      password,
    }

    // to register user
    setIsLoading(true)
    try {
      const data = await registerUser(userData)
      //console.log(data)
      await dispatch(SET_LOGIN(true))
      await dispatch(SET_NAME(data.name))
      navigate("/dashboard")
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error.message)
    }

    //console.log(formData)
  }
  return (
    <div className={`container ${styles.auth}`}>
      {isLoading && <Loader />}
      <Card>
        <div className={styles.form}>
          <div className='--flex-center'>
            <TiUserAddOutline size={35} color='#999' />
          </div>
          <h2>Register</h2>

          <form onSubmit={handleRegister}>
            <input type='text' placeholder='Name' name='name' value={name} onChange={handleInputChange} />
            <input type='text' placeholder='Email' name='email' value={email} onChange={handleInputChange} />
            <input type='password' placeholder='Password' name='password' value={password} onChange={handleInputChange} />
            <input type='password' placeholder='Confirm Password' name='password_confirm' value={password_confirm} onChange={handleInputChange} />
            <button type='submit' className='--btn --btn-primary --btn-block'>
              Register
            </button>
          </form>

          <span className={styles.register}>
            <Link to='/'>Home</Link>
            <p> &nbsp; Already have an account? &nbsp;</p>
            <Link to='/login'>Login</Link>
          </span>
        </div>
      </Card>
    </div>
  )
}

export default Register
