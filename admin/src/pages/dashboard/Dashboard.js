import React from "react"
import ProductList from "../../components/product/productList/ProductList"
import ProductSummary from "../../components/product/productSummary/ProductSummary"
import useRedirectLoggedOutUser from "../../customeHook/useRedirectLoggedOutUser"
import { useDispatch, useSelector } from "react-redux"
import { selectIsLoggedIn } from "../../redux/auth/authSlice"
import { useEffect } from "react"
import { getAllProduct } from "../../redux/product/productSlice"

const Dashboard = () => {
  useRedirectLoggedOutUser("/login")

  const dispatch = useDispatch()
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const { products, isLoading, isError, message } = useSelector((state) => state.product)

  useEffect(() => {
    if (isLoggedIn === true) {
      dispatch(getAllProduct())
    }
    //console.log(products)

    if (isError) {
      console.log(message)
    }
  }, [isLoggedIn, isError, message, dispatch])

  return (
    <div>
      <ProductSummary products={products} />
      <ProductList products={products} isLoading={isLoading} />
    </div>
  )
}

export default Dashboard
