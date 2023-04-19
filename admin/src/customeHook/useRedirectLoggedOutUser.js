import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { SET_LOGIN } from "../redux/auth/authSlice"
import { getLoginStatus } from "../services/authServices"

// to redirect in login page after token expired
const useRedirectLoggedOutUser = (path) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const redirectLoggedOutUser = async () => {
      const isLoggedIn = await getLoginStatus()
      dispatch(SET_LOGIN(isLoggedIn))
      if (!isLoggedIn) {
        toast.info("Session expired, please login to continue.")
        navigate(path)
        return
      }
    }
    redirectLoggedOutUser()
  }, [navigate, path, dispatch])
}

export default useRedirectLoggedOutUser
