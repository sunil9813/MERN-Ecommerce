import React from "react"
import loaderImg from "../../assets/loader.gif"
import ReactDOM from "react-dom"
import "./Loader.scss"

// full screen ma loader lai so garna i.e dheri component xa sum time kunai comoponet ma load hudaina
const Loader = () => {
  return ReactDOM.createPortal(
    <div className='wrapper'>
      <div className='loader'>
        <img src={loaderImg} alt='Loading...' />
      </div>
    </div>,
    document.getElementById("loader")
  )
}

export const SpinnerImg = () => {
  return (
    <div className='--center-all'>
      <img src={loaderImg} alt='Loading...' />
    </div>
  )
}

export default Loader
