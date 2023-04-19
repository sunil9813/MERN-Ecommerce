import axios from "axios"

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const API_URL = `${BACKEND_URL}/api/products/`

//create new product
const createProduct = async (formData) => {
  const res = await axios.post(`${API_URL}`, formData)
  return res.data
}

//Get all Products
const getAllProduct = async () => {
  const res = await axios.get(`${API_URL}`)
  return res.data
}

//Delete Product
const deleteProduct = async (id) => {
  const res = await axios.delete(API_URL + id)
  return res.data
}

//Get Single Product
const getProduct = async (id) => {
  const res = await axios.get(API_URL + id)
  return res.data
}

//Update Product
const updateProduct = async (id, formData) => {
  const res = await axios.patch(`${API_URL}${id}`, formData)
  return res.data
}

const productService = {
  createProduct,
  getAllProduct,
  deleteProduct,
  getProduct,
  updateProduct,
}

export default productService
