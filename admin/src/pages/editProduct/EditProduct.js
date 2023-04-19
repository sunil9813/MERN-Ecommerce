import React, { useState } from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import Loader from "../../components/loader/Loader"
import ProductForm from "../../components/product/productForm/ProductForm"
import { getAllProduct, getProduct, selectIsLoading, selectProduct, updateProduct } from "../../redux/product/productSlice"

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const isLoading = useSelector(selectIsLoading)

  // specific eidt product details hold
  const productEdit = useSelector(selectProduct)

  const [product, setProduct] = useState(productEdit)
  const [productImage, setProductImage] = useState("")
  const [imagePreview, setImagePreview] = useState(null)
  const [description, setDescription] = useState("")

  useEffect(() => {
    dispatch(getProduct(id))
  }, [dispatch, id])

  useEffect(() => {
    setProduct(productEdit)
    setImagePreview(productEdit && productEdit.image ? `${productEdit.image.filePath}` : null)
    setDescription(productEdit && productEdit.description ? productEdit.description : "")
  }, [productEdit])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProduct({
      ...product, // prev value in form
      [name]: value,
    })
  }

  const handleImageChange = (e) => {
    setProductImage(e.target.files[0])
    setImagePreview(URL.createObjectURL(e.target.files[0])) // it just give access to preview image temporary which select form your computer
  }

  //save product to DB
  const saveProduct = async (e) => {
    e.preventDefault()

    // in regulary  FormData() it doesnt catch image in backend so we used new FormData()
    const formData = new FormData()
    // now we can append various properties
    formData.append("name", product?.name) // name and product destructor state
    formData.append("category", product?.category)
    formData.append("quantity", product?.quantity)
    formData.append("price", product?.price)
    formData.append("description", description)
    if (productImage) {
      formData.append("image", productImage)
    }

    //after create form disaptch func to that we create fun
    await dispatch(updateProduct({ id, formData }))
    await dispatch(getAllProduct())
    navigate("/dashboard")
  }

  return (
    <div>
      {isLoading && <Loader />}
      <h3 className='--mt'>Edit Product</h3>
      <ProductForm product={product} productImage={productImage} imagePreview={imagePreview} description={description} setDescription={setDescription} handleInputChange={handleInputChange} handleImageChange={handleImageChange} saveProduct={saveProduct} />
    </div>
  )
}

export default EditProduct
