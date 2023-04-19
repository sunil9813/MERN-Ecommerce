const express = require("express")
const router = express.Router()
const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController")
const protect = require("../middleWare/authMiddleWare")
const { upload } = require("../utils/fileUpload")

router.post("/", protect, upload.single("image"), createProduct)
router.get("/", protect, getProducts)
router.get("/:id", protect, getProduct)
router.delete("/:id", protect, deleteProduct)
router.patch("/:id", protect, upload.single("image"), updateProduct)

module.exports = router
