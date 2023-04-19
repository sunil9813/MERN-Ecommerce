import React, { useState } from "react"
import "./Profile.scss"
import Card from "../../components/card/Card"
import ChangePassword from "../../components/changePassword/ChangePassword"
import { useSelector } from "react-redux"
import { selectUser } from "../../redux/auth/authSlice"
import Loader from "../../components/loader/Loader"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { updateUser } from "../../services/authServices"

const EditProfile = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector(selectUser)
  const { email } = user

  useEffect(() => {
    if (!email) {
      navigate("/profile")
    }
  }, [email, navigate])

  const initialState = {
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
    bio: user?.bio,
    photo: user?.photo,
  }
  const [profile, setProfile] = useState(initialState)
  const [profileImage, setProfileImage] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile({
      ...profile, // prev value in form
      [name]: value,
    })
  }

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0])
  }

  //save the product
  const saveProfile = async (e) => {
    e.preventDefault()

    setIsLoading(true)
    try {
      // handle image upload in cloudnary
      let imageURL
      if (profileImage && (profileImage.type === "image/jpeg" || profileImage.type === "image/jpg" || profileImage.type === "image/png")) {
        const image = new FormData()
        image.append("file", profileImage)
        image.append("cloud_name", "dpkp8ha7b")
        image.append("upload_preset", "qcpi319o")

        // first save image to cloudinary
        const res = await fetch("https://api.cloudinary.com/v1_1/dpkp8ha7b/image/upload", { method: "post", body: image })
        const imageData = await res.json()
        imageURL = imageData.url.toString()
        /*console.log(imageData)
        toast.success("Image Uploaded Successfully")*/
      }
      // save profile
      const formData = {
        name: profile.name,
        phone: profile.phone,
        bio: profile.bio,
        photo: profileImage ? imageURL : profile.photo,
      }

      const data = await updateUser(formData)
      console.log(data)
      toast.success("User updated successfully")
      navigate("/profile")
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
      toast.error(error.message)
    }
  }
  return (
    <div className='profile --my2'>
      {isLoading && <Loader />}

      <Card cardClass={"card --flex-dir-column"}>
        <span className='profile-photo'>
          <img src={user?.photo} alt='profilepic' />
        </span>
        <form className='--form-control --m' onSubmit={saveProfile}>
          <span className='profile-data'>
            <p>
              <label>Name:</label>
              <input type='text' name='name' value={profile?.name} onChange={handleInputChange} />
            </p>
            <p>
              <label>Email:</label>
              <input type='text' name='email' disabled value={profile?.email} onChange={handleInputChange} />
              <br />
              <code>Email cannot be changed.</code>
            </p>
            <p>
              <label>Phone:</label>
              <input type='text' name='phone' value={profile?.phone} onChange={handleInputChange} />
            </p>
            <p>
              <label>Bio:</label>
              <textarea name='bio' cols='30' rows='10' value={profile?.bio} onChange={handleInputChange}></textarea>
            </p>
            <p>
              <label>Photo:</label>
              <input type='file' name='image' onChange={handleImageChange} />
            </p>
            <div>
              <button className='--btn --btn-primary'>Edit Profile</button>
            </div>
          </span>
        </form>
      </Card>
      <br />
      <ChangePassword />
    </div>
  )
}

export default EditProfile
