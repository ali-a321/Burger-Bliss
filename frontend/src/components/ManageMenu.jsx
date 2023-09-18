import React, { useState, useEffect } from 'react'
import axios from 'axios';
import FoodModificationForm from './FoodModificationForm';
import SearchBar from './SearchBar';
import AddItemPopup from './AddItemPopup';
import { checkTokenExpiration } from '../services/tokenService';

function ManageMenu( {setRenderLogin}) {

  const [menuData, setMenuData] = useState([]);
  const [burgerMenuData, setBurgerMenuData] = useState([]);
  const [sandwichMenuData, setSandwichMenuData] = useState([]);
  const [milkshakeMenuData, setMilkshakeMenuData] = useState([]);
  const [sideMenuData, setSideMenuData] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [filteredMenuData, setFilteredMenuData] = useState([]);

  useEffect(() => {
    const tokenValid = checkTokenExpiration();    
    if (tokenValid) {
      setRenderLogin(false);
    } else {
      setRenderLogin(true);
    }
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:8000/burger/menu/get')
      .then((response) => {
        setMenuData(response.data);
        setBurgerMenuData(response.data.filter((item) => item.category_name === "Burgers"));
        setSandwichMenuData(response.data.filter((item) => item.category_name === "Sanwiches"));
        setMilkshakeMenuData(response.data.filter((item) => item.category_name === "Milkshakes"));
        setSideMenuData(response.data.filter((item) => item.category_name === "Sides"));
      })
      .catch((error) => {
        console.error('Error fetching menu data:', error);
      });
  }, []);
  
  const reloadMenu = () => {
    axios
    .get('http://localhost:8000/burger/menu/get')
    
    .then((response) => {
      setMenuData(response.data);
      setBurgerMenuData(response.data.filter((item) => item.category_name === "Burgers"));
      setSandwichMenuData(response.data.filter((item) => item.category_name === "Sandwiches"));
      setMilkshakeMenuData(response.data.filter((item) => item.category_name === "Milkshakes"));
      setSideMenuData(response.data.filter((item) => item.category_name === "Sides"));
    })
    .catch((error) => {
      console.error('Error fetching menu data:', error);
    });
  }

  const handleAddItem = (newItem) => {
   
    axios.post('http://localhost:8000/burger/menu/add', newItem, {
      withCredentials: true,
    })
      .then((response) => {
        reloadMenu();
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setRenderLogin(true);
        } else {
          console.error('Error adding new item:', error);
        }
      });
  };

  

  return (
    <div className='blackBg'>
      <button className='addFoodBtn' onClick={() => setShowAddPopup(true)}>Add Food Item</button>
      <div className='center'> 
        <SearchBar menuData={menuData} setFilteredMenuData={setFilteredMenuData} />
      </div>
      {filteredMenuData.length > 0 ? 
      <div className='signatureTitle'>  Matches </div> : ""}
      <div className='burgerNameContainer'>
        {filteredMenuData.length > 0 ? (
          filteredMenuData.map((foodItem) => (
            <FoodModificationForm key={foodItem.id} foodItem={foodItem} reloadMenu={reloadMenu} setFilteredMenuData={setFilteredMenuData} setRenderLogin={setRenderLogin}/>
          ))
        ) : ""}
      </div>
     
      <AddItemPopup showPopup={showAddPopup} setShowPopup={setShowAddPopup} handleAddItem={handleAddItem} />
     
      <div className='signatureTitle'>  Menu</div>

       <div className='burgerNameContainer'> 
       {menuData.map((foodItem) => (
        <FoodModificationForm key={foodItem.id} foodItem={foodItem} reloadMenu={reloadMenu} setFilteredMenuData={setFilteredMenuData} setRenderLogin={setRenderLogin} />
      ))}
      </div>

    </div>
  )
}

export default ManageMenu