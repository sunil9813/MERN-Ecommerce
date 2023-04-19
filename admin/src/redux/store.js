import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./auth/authSlice"
import filterSlice from "./product/filterSlice"
import productSlice from "./product/productSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    product: productSlice,
    filter: filterSlice,
  },
})
