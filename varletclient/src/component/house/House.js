import React from 'react'
import Heading from '../headerfooter/Heading';
import Footer from '../headerfooter/Footer';
import '../../style/house.css';
function house() {
  return (
    <>
      <Heading/>
    <div style={{ paddingTop: '100px' }}>
    <div className='background'><img src="http://localhost:8070/images/oceans.jpg" alt="Background" /></div>
      <div className='main'>
        <h1>국내 숙소</h1>
      </div>
    </div>
      <Footer/>
    </>
  )
}

export default house