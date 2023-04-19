import { useSelector } from "react-redux"
import { selectIsLoggedIn } from "../../redux/auth/authSlice"

export const ShowOnLogin = ({ children }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn)

  if (isLoggedIn) {
    return <>{children}</>
  }
  return null
}

export const ShowOnLogout = ({ children }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn)

  if (!isLoggedIn) {
    return <>{children}</>
  }
  return null
}
