import React from 'react'
import fb from "../images/fblogo.png"
import ig from "../images/iglogo.png"
import siteLogo from "../images/siteLogo.png"
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <div className='footerContainer'>
        <div className='firstColumn'> 
            <Link to='/'> Home </Link>
            <Link to='/menu'> Menu </Link>
            <Link to='/about'> About Us </Link>
            <Link to='/contact'> Contact Us </Link>
        </div>

        <div className='secondColumn'> 
            <div className='followUsTitle'> Follow Us </div>
            <div className='logoContain'> 
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <img src={fb} alt="Facebook logo" className="miniSocialLogo" />
            </a>

            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <img src={ig} alt="Instagram logo" className="miniSocialLogo" />
            </a>
            </div>
        </div>
        <div className='thirdColumn'> 
            <img src={siteLogo} alt='burger bliss logo'className='companyLogoFooter'/>
        </div>

       
    </div>
  )
}

export default Footer