import Login from '../components/Login'
import React, { useState, useEffect } from 'react';
import LiveOrders from '../components/LiveOrders'; 
import ManageMenu from '../components/ManageMenu';
import ManageCategories from '../components/ManageCategories';
import ManageMessage from "../components/ManageMessage"
import Logout from '../components/Logout';
import AdminHeader from '../components/AdminHeader';


function Admin() {

    const [activeTab, setActiveTab] = useState('live-orders'); 
    const [renderLogout, setRenderLogout] = useState(false);
    const [renderLogin, setRenderLogin] = useState(true);

    const renderContent = () => {
      switch (activeTab) {
        case 'live-orders':
          return <LiveOrders setRenderLogin = {setRenderLogin} />;
        case 'manage-menu':
          return <ManageMenu setRenderLogin = {setRenderLogin} />;
        case 'manage-categories':
          return <ManageCategories setRenderLogin = {setRenderLogin}/>;
          case 'manage-message':
            return <ManageMessage setRenderLogin = {setRenderLogin}/>;
        default:
          return null;
      }
    };
    const handleLogout = () => {
      setRenderLogout(true)
    }

     

  return (
    <>
     <AdminHeader setRenderLogout ={setRenderLogout} renderLogout = {renderLogout} setActiveTab={setActiveTab} activeTab={activeTab} handleLogout={handleLogout} />
    
    <div className='adminPage'>  
      <Login setRenderLogin = {setRenderLogin} renderLogin={renderLogin} />
      {!renderLogin ? 
        <div className="content">{renderContent()}</div> 
        : ""}
      {renderLogout ?  <Logout setRenderLogout ={setRenderLogout}/> : ""}
    
    </div>
    </>
  )
}

export default Admin