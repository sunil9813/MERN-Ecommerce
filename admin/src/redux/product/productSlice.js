import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { toast } from "react-toastify"
import productService from "../../services/productServices"

const initialState = {
  product: null,
  products: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  totalStoreValue: 0,
  outOfStock: 0,
  category: [],
}

// create new product
export const createProduct = createAsyncThunk("products/create", async (formData, thunkAPI) => {
  try {
    return await productService.createProduct(formData)
  } catch (error) {
    const message = (error.res && error.res.data && error.res.data.message) || error.message || error.toString()
    toast.error(message)
    console.log(message)
    return thunkAPI.rejectWithValue(message)
  }
})

// get all product
export const getAllProduct = createAsyncThunk("products/getAll", async (_, thunkAPI) => {
  try {
    return await productService.getAllProduct()
  } catch (error) {
    const message = (error.res && error.res.data && error.res.data.message) || error.message || error.toString()
    toast.error(message)
    console.log(message)
    return thunkAPI.rejectWithValue(message)
  }
})

// Delete Product
export const deleteProduct = createAsyncThunk("products/delete", async (id, thunkAPI) => {
  try {
    return await productService.deleteProduct(id)
  } catch (error) {
    const message = (error.res && error.res.data && error.res.data.message) || error.message || error.toString()
    toast.error(message)
    console.log(message)
    return thunkAPI.rejectWithValue(message)
  }
})

// Get Single Product
export const getProduct = createAsyncThunk("products/getProduct", async (id, thunkAPI) => {
  try {
    return await productService.getProduct(id)
  } catch (error) {
    const message = (error.res && error.res.data && error.res.data.message) || error.message || error.toString()
    toast.error(message)
    console.log(message)
    return thunkAPI.rejectWithValue(message)
  }
})

// updateProduct
export const updateProduct = createAsyncThunk("products/updateProduct", async ({ id, formData }, thunkAPI) => {
  try {
    return await productService.updateProduct(id, formData)
  } catch (error) {
    const message = (error.res && error.res.data && error.res.data.message) || error.message || error.toString()
    toast.error(message)
    console.log(message)
    return thunkAPI.rejectWithValue(message)
  }
})

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // step 2:
    CALC_STORE_VALUE(state, action) {
      const products = action.payload
      const arrya = []
      products.map((item) => {
        const { price, quantity } = item
        const productValue = price * quantity
        return arrya.push(productValue)
      })
      const totalValue = arrya.reduce((a, b) => {
        return a + b
      }, 0)
      state.totalStoreValue = totalValue
    },
    CALA_OUTOF_STOCK(state, action) {
      const products = action.payload
      const arrya = []
      products.map((item) => {
        const { quantity } = item
        return arrya.push(quantity)
      })
      let count = 0
      arrya.forEach((number) => {
        if (number === 0 || number === "0") {
          count += 1
        }
      })
      state.outOfStock = count
    },
    CALA_CATEGORY(state, action) {
      const products = action.payload
      const arrya = []
      products.map((item) => {
        const { category } = item
        return arrya.push(category)
      })
      const uniqueCategory = [...new Set(arrya)]
      state.category = uniqueCategory
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        console.log(action.payload)
        state.products.push(action.payload)
        toast.success("Product add successfully")
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        toast.error(action.payload)
      }) // get product all
      .addCase(getAllProduct.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllProduct.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        console.log(action.payload)
        state.products = action.payload
      })
      .addCase(getAllProduct.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        toast.error(action.payload)
      }) // delete product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        toast.success("Product Deleted Successfully")
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        toast.error(action.payload)
      }) // get single product
      .addCase(getProduct.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        state.product = action.payload
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        toast.error(action.payload)
      }) // update product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        toast.success("Product Updated Successfully")
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        toast.error(action.payload)
      })
  },
})
export const { CALC_STORE_VALUE, CALA_OUTOF_STOCK, CALA_CATEGORY } = productSlice.actions

export const selectIsLoading = (state) => state.product.isLoading
export const selectProduct = (state) => state.product.product
export const selectTotalStoreValue = (state) => state.product.totalStoreValue
export const selectOutOfStock = (state) => state.product.outOfStock
export const selectCategory = (state) => state.product.category

export default productSlice.reducer
