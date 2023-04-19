const dotenv = require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")

const userRoute = require("./routes/userRoute")
const productRoute = require("./routes/productRoute")
const contactRoute = require("./routes/contactRoute")
const errorHandler = require("./middleWare/errorMiddleWare")
const cookieParser = require("cookie-parser")
const path = require("path")

const app = express()

//middlewares
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
//app.use(cors()) // request form backend to frontend

// to exchange credentials
app.use(
  cors({
    origin: ["http://localhost:3000", "https://Inventory_Stock_Management.app"],
    credentials: true,
  })
)

const PORT = process.env.PORT || 5000

//connect to mongoose
mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.log(err)
  })

//Routes Middleware
app.use("/api/users", userRoute)
app.use("/api/products", productRoute)
app.use("/api/contactus", contactRoute)

app.use("/uploads", express.static(path.join(__dirname, "uploads")))
// Erro Middleware
app.use(errorHandler)

// Routes
app.get("/", (req, res) => {
  res.send("Home Pages")
})