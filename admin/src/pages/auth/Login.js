import React, { useState } from "react"
import styles from "./auth.module.scss"
import { BiLogIn } from "react-icons/bi"
import Card from "../../components/card/Card"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { loginUser, validateEmail } from "../../services/authServices"
import { SET_LOGIN, SET_NAME } from "../../redux/auth/authSlice"
import Loader from "../../components/loader/Loader"

const initialState = {
  name: "",
  email: "",
  password: "",
  password_confirm: "",
}
const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialState)
  const [isLoading, setIsLoading] = useState(false) // to monitor loading
  const { email, password } = formData

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData, // prev value in form
      [name]: value,
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    //console.log(formData)

    //validation in frontend
    if (!email || !password) {
      return toast.error("All fields are required")
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter valid email")
    }

    const userData = {
      email,
      password,
    }
    setIsLoading(true)

    try {
      const data = await loginUser(userData)
      console.log(data)
      await dispatch(SET_LOGIN(true))
      await dispatch(SET_NAME(data.name))
      navigate("/dashboard")
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error.message)
    }
  }

  return (
    <div className={`container ${styles.auth}`}>
      {isLoading && <Loader />}
      <Card>
        <div className={styles.form}>
          <div className='--flex-center'>
            <BiLogIn size={35} color='#999' />
          </div>
          <h2>Login</h2>

          <form onSubmit={handleLogin}>
            <input type='text' placeholder='Email' name='email' value={email} onChange={handleInputChange} />
            <input type='password' placeholder='Password' name='password' value={password} onChange={handleInputChange} />
            <button type='submit' className='--btn --btn-primary --btn-block'>
              Login
            </button>
          </form>
          <Link to='/forgot'>Forgot Password</Link>

          <span className={styles.register}>
            <Link to='/'>Home</Link>
            <p> &nbsp; Don't have an account? &nbsp;</p>
            <Link to='/register'>Register</Link>
          </span>
        </div>
      </Card>
    </div>
  )
}

export default Login
