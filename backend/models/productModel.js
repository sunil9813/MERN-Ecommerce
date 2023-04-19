const mongoose = require("mongoose")

/* 
When type is string 
trime: true,
"ABC " , "     ABC  ", ==> "ABC"
*/
const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    name: {
      type: String,
      require: [true, "Please add a product name"],
      trime: true,
    },
    //sku => unique number to identify
    sku: {
      type: String,
      require: true,
      default: "SKU",
      trime: true,
    },
    category: {
      type: String,
      require: [true, "Please add a category"],
      trime: true,
    },
    quantity: {
      type: String,
      require: [true, "Please add a quantity"],
      trime: true,
    },
    price: {
      type: String,
      required: [true, "Please add a price"],
      trime: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      trime: true,
    },
    image: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
)
const product = mongoose.model("Product", productSchema)
module.exports = product
