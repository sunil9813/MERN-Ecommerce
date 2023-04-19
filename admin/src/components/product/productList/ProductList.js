import React, { useState } from "react"
import "./productList.scss"
import Search from "../../search/Search"
import { SpinnerImg } from "../../loader/Loader"
import { AiOutlineEye } from "react-icons/ai"
import { FaEdit, FaTrash } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { FILTER_PRODUCT, selectFilteredProduct } from "../../../redux/product/filterSlice"
import { useEffect } from "react"
import ReactPaginate from "react-paginate"
import { confirmAlert } from "react-confirm-alert" // Import
import "react-confirm-alert/src/react-confirm-alert.css" // Import css
import { deleteProduct, getAllProduct } from "../../../redux/product/productSlice"
import { Link } from "react-router-dom"

const ProductList = ({ products, isLoading }) => {
  const shortenText = (text, n) => {
    if (text.length > n) {
      const shortendText = text.substring(0, n).concat("...")
      return shortendText
    }
    return text
  }
  // Search Function
  const [search, setSearch] = useState("")
  const dispatch = useDispatch()
  const filteredProducts = useSelector(selectFilteredProduct)

  useEffect(() => {
    dispatch(FILTER_PRODUCT({ products, search }))
  }, [products, search, dispatch])

  //Begin pagination
  const [currentItems, setCurrentItems] = useState([])
  const [pageCount, setPageCount] = useState(0)
  const [itemOffset, setItemOffset] = useState(0)
  const itemsPerPage = 5

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage
    setCurrentItems(filteredProducts.slice(itemOffset, endOffset))
    setPageCount(Math.ceil(filteredProducts.length / itemsPerPage))
  }, [itemOffset, itemsPerPage, filteredProducts])

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredProducts.length
    setItemOffset(newOffset)
  }
  //End pagination

  // delete
  const delProduct = async (id) => {
    await dispatch(deleteProduct(id))
    await dispatch(getAllProduct())
  }

  // delete popup
  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete Product",
      message: "Are you sure you want to delete this product.",
      buttons: [
        {
          label: "Delete",
          onClick: () => delProduct(id),
        },
        {
          label: "Cancel",
        },
      ],
    })
  }
  return (
    <div className='product-list'>
      <hr />
      <div className='table'>
        <div className='--flex-between --flex-dir-column'>
          <span>
            <h3>Inventory Items</h3>
          </span>
          <span>
            <Search value={search} onChange={(e) => setSearch(e.target.value)} />
          </span>
        </div>
        {isLoading && <SpinnerImg />}

        <div className='table'>
          {!isLoading && products?.length === 0 ? (
            <p>No Product Found!, Please add a Product</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>S.N</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Value</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {/*{filteredProducts.map((product, index) => {*/}
                {currentItems.map((product, index) => {
                  const { _id, name, category, price, quantity } = product
                  return (
                    <>
                      <tr key={_id}>
                        <td>{index + 1}</td>
                        <td>{shortenText(name, 18)}</td>
                        <td>{category}</td>
                        <td>$ {price}</td>
                        <td>{quantity}</td>
                        <td>$ {price * quantity}</td>
                        <td className='icons'>
                          <span>
                            <Link to={`/product-detail/${_id}`}>
                              <AiOutlineEye size={25} color={"purple"} />
                            </Link>
                          </span>
                          <span>
                            <Link to={`/edit-product/${_id}`}>
                              <FaEdit size={20} color={"green"} />
                            </Link>
                          </span>
                          <span>
                            <FaTrash size={20} color={"red"} onClick={() => confirmDelete(_id)} />
                          </span>
                        </td>
                      </tr>
                    </>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
        <ReactPaginate breakLabel='...' nextLabel='Next' onPageChange={handlePageClick} pageRangeDisplayed={3} pageCount={pageCount} previousLabel='Prev' renderOnZeroPageCount={null} containerClassName='pagination' pageLinkClassName='page-num' previousLinkClassName='page-num' nextLinkClassName='page-num' activeLinkClassName='activePage' />
      </div>
    </div>
  )
}

export default ProductList
