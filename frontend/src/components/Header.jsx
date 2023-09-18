import React, { useState } from 'react';
import siteLogo from "../images/siteLogo.png"
import { Link, useLocation, navigate, useNavigate } from 'react-router-dom';
import listIcon from "../images/listIcon.jpg"
import cart from '../images/cart.png';

function Header({cartCount}) {
  const location = useLocation();
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const closeMenuAndNavigate = (url) => {
    setIsOpen(false);
    navigate(url); 
  };

  return (
    <div className='headerContainer'>
        
        <div className='logoContainer'>
            <img src={listIcon} alt='list' className='listIcon' onClick={toggleMenu}/>

            <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
                <div className="menu-toggle" onClick={toggleMenu}>
                    {isOpen ? 'X' : <img src={listIcon} alt='list' className='listIcon' />}
                </div>
                <div className="menu-items">
                    <div onClick={() => closeMenuAndNavigate('/menu')}>Menu</div>
                    <div onClick={() => closeMenuAndNavigate('/about')}>About Us</div>
                    <div onClick={() => closeMenuAndNavigate('/contact')}>Contact Us</div>
                </div>
            </div>
            <Link to='/'>
            <img src ={siteLogo} alt='Burger Bliss' className='siteLogo' />
            </Link>
            <Link to='/' className='headerTitle'>Burger Bliss  </Link>
        </div>

        <div className='tabContainer'>
            <Link to='/menu' className={`tab ${location.pathname === '/menu' ? 'tabSelected' : ''}`}>
            Menu
            </Link>
            <Link to='/about' className={`tab ${location.pathname === '/about' ? 'tabSelected' : ''}`}>
            About Us
            </Link>
            <Link to='/contact' className={`tab ${location.pathname === '/contact' ? 'tabSelected' : ''}`}>
            Contact Us
            </Link>
           {cartCount> 0 ?  <div className='checkoutTab'> 
           <Link to='/checkout' className={`ordertab ${location.pathname === '/checkout' ? 'tabSelected' : ''}`}>
           Checkout
            </Link>
          <div className="shoppingCart" onClick={() => closeMenuAndNavigate('/checkout')}>
            <img src={cart} alt="shopping cart" className="cartImg" />
            <div className="cartBadge"> {cartCount} </div>
          </div>
        </div> :
        
            <Link to='/order' className={`ordertab ${location.pathname === '/order' ? 'tabSelected' : ''}`}>
            Order Online
            </Link>
            }
        </div>
    </div>
  );
}

export default Header;






