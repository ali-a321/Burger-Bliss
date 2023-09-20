import React, { useEffect } from 'react';
import Header from '../components/Header'
import secondmainpic from "../images/landingpage2.webp"
import fb from "../images/fblogo.png"
import ig from "../images/iglogo.png"
import { Link, useLocation, navigate, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer'
import cooking from "../images/burgersleft.jpg"
import cashier from "../images/cashier.jpg"
import mid from "../images/mid.jpg"


function Homepage() {
  const navigate = useNavigate()

  const openMenu = () => {
    navigate('/menu')
  }
  // const { pathname } = useLocation();

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, [pathname]);

  return (
    <div className='mainBody'>
        <Header />
        <div className='homePageContainer'> </div>
        <div className="mainPicContainer">
        </div>
        <div className="secondmainPicContainer">
          <img src={secondmainpic} alt="burgers" className="secondmainPic" loading='lazy'/>
        </div>
        <div className='center'> 
          <div className='firstTextContainer'>

            <div className='firstTextTitle'> FRESH, HALAL, LOCAL </div>
            <div className='firstText'> At Burger Bliss our commitment is to delight Toronto burger enthusiasts with a diverse range of freshly prepared delights. We take pride in crafting burgers that are a cut above the rest, expertly grilled to perfection. Our primary aim is to guarantee that your burger experience is consistently top-notch – always fresh, thoughtfully seasoned, and served piping hot. Whether you choose to dine in with us or place an online order, savor the finest burgers in the city, prepared just the way you like them.</div>
            <div className='exploreContainer' onClick={()=> openMenu()}> 
              <div className='menuBtnHome'> Explore Our Menu </div>
            </div>
          </div>
          <div className='socialContainer'> 
            <div className='socialHeader'> Get Social </div>
            <div> 
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <img src = {fb} alt='facebook' className='socialLogo'/>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <img src = {ig} alt='instagram' className='socialLogo'/>
            </a>
            </div>
            <div className='threePicContainer'> 
              <img src = {cooking} alt='burger being cooked' className='threePic' loading='lazy'/>
              <img src = {mid} alt='serving the meal' className='threePic' loading='lazy'/>
              <img src = {cashier} alt='cashier' className='midPic' loading='lazy'/>
            </div>
          </div>
        </div>

        <Footer/>
    </div>
  )
}

export default Homepage