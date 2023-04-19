import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  filterProducts: [],
}

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    FILTER_PRODUCT(state, action) {
      const { products, search } = action.payload
      const tempProducts = products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()) || product.category.toLowerCase().includes(search.toLowerCase()))
      state.filterProducts = tempProducts
    },
  },
})

export const { FILTER_PRODUCT } = filterSlice.actions

export const selectFilteredProduct = (state) => state.filter.filterProducts

export default filterSlice.reducer
