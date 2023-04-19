import React, { useEffect } from "react"
import "./ProductSummary.scss"
import { AiFillDollarCircle } from "react-icons/ai"
import { BsCart4, BsCartX } from "react-icons/bs"
import { BiCategory } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import InfoBox from "../../infoBox/InfoBox"
import { CALA_CATEGORY, CALA_OUTOF_STOCK, CALC_STORE_VALUE, selectCategory, selectOutOfStock, selectTotalStoreValue } from "../../../redux/product/productSlice"

// Icons
const earningIcon = <AiFillDollarCircle size={40} color='#fff' />
const productIcon = <BsCart4 size={40} color='#fff' />
const categoryIcon = <BiCategory size={40} color='#fff' />
const outOfStockIcon = <BsCartX size={40} color='#fff' />

// formate amount i.e 2,00,000
export const formatNumbers = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const ProductSummary = ({ products }) => {
  const dispatch = useDispatch()
  const totalStoreValue = useSelector(selectTotalStoreValue)
  const totalOutOfStock = useSelector(selectOutOfStock)
  const totalCategory = useSelector(selectCategory)

  useEffect(() => {
    dispatch(CALC_STORE_VALUE(products))
    dispatch(CALA_OUTOF_STOCK(products))
    dispatch(CALA_CATEGORY(products))
  }, [dispatch, products])

  return (
    <div className='product-summary'>
      <h3 className='--mt'>Inventory Stats</h3>
      <div className='info-summary'>
        <InfoBox icon={productIcon} title={"Total Products"} bgColor='card1' count={products?.length} />
        <InfoBox icon={earningIcon} title={"Total Store Value"} bgColor='card2' count={`$ ${formatNumbers(totalStoreValue.toFixed(2))}`} />
        <InfoBox icon={outOfStockIcon} title={"Out of Stock"} bgColor='card3' count={totalOutOfStock} />
        <InfoBox icon={categoryIcon} title={"All Categories"} bgColor='card4' count={totalCategory?.length} />
      </div>
    </div>
  )
}

export default ProductSummary
