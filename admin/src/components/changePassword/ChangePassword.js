import React, { useState } from "react"
import "./ChangePassword.scss"
import Card from "../card/Card"
import { toast } from "react-toastify"
import { changePassword } from "../../services/authServices"
import { useNavigate } from "react-router-dom"

const initialState = {
  oldPassword: "",
  password: "",
  password_confirm: "",
}
const ChangePassword = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialState)
  const [isLoading, setIsLoading] = useState(false)
  const { oldPassword, password, password_confirm } = formData

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData, // prev value in form
      [name]: value,
    })
  }

  const chaPassword = async (e) => {
    e.preventDefault()

    if (password !== password_confirm) {
      return toast.error("new Password do not match")
    }

    const formData = {
      oldPassword,
      password,
    }

    const data = await changePassword(formData)
    toast.success(data)
    navigate("/profile")
  }
  return (
    <div className='change-password'>
      <Card cardClass={"password-card"}>
        <h3>Change Password</h3>
        <form className='--form-control' onSubmit={chaPassword}>
          <input type='password' placeholder='Old Password' required name='oldPassword' value={oldPassword} onChange={handleInputChange} />
          <input type='password' placeholder='New Password' required name='password' value={password} onChange={handleInputChange} />
          <input type='password' placeholder='Confirm New Password' required name='password_confirm' value={password_confirm} onChange={handleInputChange} />
          <button type='submit' className='--btn --btn-primary'>
            Change Password
          </button>
        </form>
      </Card>
    </div>
  )
}

export default ChangePassword
