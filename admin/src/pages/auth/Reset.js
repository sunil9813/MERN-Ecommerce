import React, { useState } from "react"
import styles from "./auth.module.scss"
import { MdPassword } from "react-icons/md"
import Card from "../../components/card/Card"
import { Link, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { resetPassword } from "../../services/authServices"

const initialState = {
  password: "",
  password_confirm: "",
}
const Reset = () => {
  const [formData, setFormData] = useState(initialState)
  const { password, password_confirm } = formData

  const { resetToken } = useParams()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData, // prev value in form
      [name]: value,
    })
  }

  const reset = async (e) => {
    e.preventDefault()
    console.log(formData)
    console.log(resetToken)

    if (password.length < 8) {
      return toast.error("Password must be 8 characters")
    }
    if (password !== password_confirm) {
      return toast.error("Password do not match")
    }

    const userData = {
      password,
      password_confirm,
    }

    try {
      const data = await resetPassword(userData, resetToken)
      toast.success(data.message)
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <div className='--flex-center'>
            <MdPassword size={35} color='#999' />
          </div>
          <h2>Reset Password</h2>

          <form onSubmit={reset}>
            <input type='password' placeholder='New Password' name='password' value={password} onChange={handleInputChange} />
            <input type='password' placeholder='Confirm New Password' name='password_confirm' value={password_confirm} onChange={handleInputChange} />

            <button type='submit' className='--btn --btn-primary --btn-block'>
              Reset Password
            </button>
            <div className={styles.links}>
              <p>
                <Link to='/'>- Home</Link>
              </p>
              <p>
                <Link to='/login'>- Login</Link>
              </p>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}

export default Reset
