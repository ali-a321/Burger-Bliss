import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import listIcon from "../images/listIcon.jpg"
import siteLogo from "../images/siteLogo.png"

function AdminHeader({ setActiveTab, activeTab, handleLogout  }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenuAndNavigate = (route) => {
        setActiveTab(route)
        setIsOpen(false);
    };

   
    return (
        <div className='headerContainer'>
            <div className='logoContainer'>
                <img src={listIcon} alt='list' className='listIcon' onClick={toggleMenu} />

                <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
                    <div className="menu-toggle" onClick={toggleMenu}>
                        {isOpen ? 'X' : <img src={listIcon} alt='list' className='listIcon' />}
                    </div>
                    <div className="menu-items">
                        <div onClick={() => closeMenuAndNavigate('live-orders')}>Live Orders</div>
                        <div onClick={() => closeMenuAndNavigate('manage-menu')}>Manage Menu</div>
                        <div onClick={() => closeMenuAndNavigate('manage-categories')}>Manage Categories</div>
                        <div onClick={() => closeMenuAndNavigate('manage-message')}>Manage Messages</div>
                    </div>
                </div>
                <Link to='/'>
                    <img src={siteLogo} alt='Burger Bliss' className='siteLogo' />
                </Link>
                <Link to='/' className='headerTitle'>Burger Bliss</Link>
            </div>

            <div className='tabContainer'>
                <div
                    className={`tab ${activeTab === 'live-orders' ? 'tabSelected' : ''}`}
                    onClick={() => setActiveTab('live-orders')}
                >
                    Live Orders
                </div>
                <div
                    className={`tab ${activeTab === 'manage-menu' ? 'tabSelected' : ''}`}
                    onClick={() => setActiveTab('manage-menu')}
                >
                    Manage Menu
                </div>
                <div
                    className={`tab ${activeTab === 'manage-categories' ? 'tabSelected' : ''}`}
                    onClick={() => setActiveTab('manage-categories')}
                >
                    Manage Categories
                </div>
                <div
                    className={`tab ${activeTab === 'manage-message' ? 'tabSelected' : ''}`}
                    onClick={() => setActiveTab('manage-message')}
                >
                    Manage Messages
                </div>
                <div className="ordertab" onClick={() => handleLogout()}>
                    Logout
                </div>  
            </div>
        </div>
       
    );
}

export default AdminHeader;