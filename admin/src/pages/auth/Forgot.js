import React, { useState } from "react"
import styles from "./auth.module.scss"
import { AiOutlineMail } from "react-icons/ai"
import Card from "../../components/card/Card"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { forgetPassword, validateEmail } from "../../services/authServices"

const Forgot = () => {
  const [email, setEmail] = useState("")

  const forget = async (e) => {
    e.preventDefault()

    if (!email) {
      return toast.error("Please enter an email")
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter valid email")
    }

    const userData = {
      email,
    }

    await forgetPassword(userData)
    setEmail("")
  }
  return (
    <div className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <div className='--flex-center'>
            <AiOutlineMail size={35} color='#999' />
          </div>
          <h2>Forgot Password</h2>

          <form onSubmit={forget}>
            <input type='email' placeholder='Email' required name='email' value={email} onChange={(e) => setEmail(e.target.value)} />

            <button type='submit' className='--btn --btn-primary --btn-block'>
              Get Reset Email
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

export default Forgot
