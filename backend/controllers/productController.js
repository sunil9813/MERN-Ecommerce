const asyncHandler = require("express-async-handler")
const Product = require("../models/productModel")
const { fileSizeFormatter } = require("../utils/fileUpload")
const cloudinary = require("cloudinary").v2

//create product
const createProduct = asyncHandler(async (req, res) => {
  //accept data from body
  const { name, sku, category, quantity, price, description } = req.body

  //validation
  if (!name || !category || !quantity || !price || !description) {
    res.status(400) // 400 Bad Request
    throw new Error("Please fill in all fields")
  }

  //Handle Image upload
  /* Step 1 : create fileUpload folder inside utils
   */
  let fileData = {}
  if (req.file) {
    //step 2 : save image to cloudinary
    let uploadedFile
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Gosto Ecommerce App",
        resource_type: "image",
      })
    } catch (error) {
      res.status(500)
      throw new Error("Image colud not be uploaded")
    }
    //step 1 :
    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
      // fileSize: req.file.size, // file ko size chai byte ma dinxa so we have to convert into KB
    }
  }

  // create porduct in DB
  const product = await Product.create({
    // property you want create in product
    user: req.user.id,
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image: fileData,
  })
  res.status(201).json(product) // 201 => The request has been fulfilled and resulted in a new resource being created
})

// get all product
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user.id }).sort("-createdAt")
  res.status(200).json(products)
})

//get single product
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  //if product doesn't exit
  if (!product) {
    res.status(404)
    throw new Error("Product not found")
  }

  // match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(401) // 401 =>  the client request has not been completed because it lacks valid authentication credentials for the requested resource
    throw new Error("User not authorized")
  }
  res.status(200).json(product)
})

//delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  //if product doesn't exit
  if (!product) {
    res.status(404)
    throw new Error("Product not found")
  }

  // match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(401) // 401 =>  the client request has not been completed because it lacks valid authentication credentials for the requested resource
    throw new Error("User not authorized")
  }
  await product.remove()
  res.status(200).json({ message: "Product deleted." })
})

// update product
const updateProduct = asyncHandler(async (req, res) => {
  const { name, category, quantity, price, description } = req.body
  const { id } = req.params

  const product = await Product.findById(id)

  //if product doesn't exits
  if (!product) {
    res.status(404)
    throw new Error("Product not found")
  }

  // match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(401) // 401 =>  the client request has not been completed because it lacks valid authentication credentials for the requested resource
    throw new Error("User not authorized")
  }

  //Handle Image upload
  let fileData = {}
  if (req.file) {
    //step 2 : save image to cloudinary
    let uploadedFile
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Gosto Ecommerce App",
        resource_type: "image",
      })
    } catch (error) {
      res.status(500)
      throw new Error("Image colud not be uploaded")
    }
    //step 1 :
    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
      // fileSize: req.file.size, // file ko size chai byte ma dinxa so we have to convert into KB
    }
  }

  // update product
  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: id },
    {
      name,
      category,
      quantity,
      price,
      description,
      image: Object.keys(fileData).length === 0 ? product?.image : fileData,
    },
    {
      new: true,
      runValidators: true,
    }
  )

  res.status(200).json(updatedProduct)
})

module.exports = { createProduct, getProducts, getProduct, deleteProduct, updateProduct }
