import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

function Order() {
  const [menuData, setMenuData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );
  const [cartCount, setCartCount] = useState(
    parseInt(localStorage.getItem("cartCount")) || 0
  );
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  // Define categoryRefs to store refs for each category
  const categoryRefs = {};

  useEffect(() => {
    axios
      .get('http://localhost:8000/burger/menu/get')
      .then((response) => {
        setMenuData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching menu data:', error);
      });
  }, []);

  // Calculate categories after fetching menuData
  const categories = [...new Set(menuData.map((item) => item.category_name))];
  useEffect(() => {
    // Set an initial category when the component mounts
    if (categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

  const groupMenuItemsByCategory = (menuData) => {
    const groupedMenu = {};
    menuData.forEach((item) => {
      const { category_name } = item;
      if (!groupedMenu[category_name]) {
        groupedMenu[category_name] = [];
      }
      groupedMenu[category_name].push(item);
    });

    return groupedMenu;
  };

  const groupedMenu = groupMenuItemsByCategory(menuData);

  const handleAdd = (menuItem, e) => {
    const updatedCart = [...cartItems, { ...menuItem, count: 1 }];
    setCartItems(updatedCart);
    setCartCount(cartCount + 1);

    const buttonRect = e.target.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    setPopupPosition({
      top: buttonRect.top + scrollTop - buttonRect.height - 25,
      left: buttonRect.left + buttonRect.width - 100,
      height: e.target.offsetHeight,
    });
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    localStorage.setItem('cartCount', (cartCount+1).toString());
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 1000);
  };

  const handleRemove = (menuItem) => {
    // Find the index of the first item with the specified food_id
    const index = cartItems.findIndex((cartItem) => cartItem.food_id === menuItem.food_id);
    
    // If the item was found, remove it
    if (index !== -1) {
      // Create a copy of the cartItems array
      const updatedCart = [...cartItems];
      // Remove one instance of the item at the found index
      updatedCart.splice(index, 1);
      // Update the cart with the modified array
      setCartItems(updatedCart);
      setCartCount(cartCount-1)
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      localStorage.setItem('cartCount', (cartCount-1).toString());
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setActiveCategory(category);
    categoryRefs[category].current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <Header cartCount = {cartCount} />
      <div className="container">
        <div className="sidebar">
          <h2>Categories</h2>
          <ul>
            {categories.map((category) => {
              categoryRefs[category] = React.createRef();
              return (
                <div
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className="sideTabCategory"
                >
                  {category}
                </div>
              );
            })}
          </ul>
        </div>
       
        <div className="orderMenu">
       
          {Object.entries(groupedMenu).map(([category, items]) => (
            <div key={category} ref={categoryRefs[category]}>
              <div className="ordersTitle">{category}</div>
              <div className="orderNameContainer">
                {items.map((menuItem) => (
                  <div className="burgerInfo" key={menuItem.food_id}>
                    {menuItem.food_picture ? (
                      <img src={menuItem.food_picture} className="burgerPicture" alt={menuItem.food_name} />
                    ) : null}

                    <div className="burgerTitle">{menuItem.food_name}</div>
                    <div className="burgerDescription">{menuItem.descriptions}</div>
                    <div className="burgerPrice">${menuItem.price}</div>
                    <div className="burgerButtons">
                      <button className="editButton" onClick={(event) => handleAdd(menuItem, event)}>
                        Add to cart
                      </button>
                      {showPopup && (
                        <div
                          className="popupAdd"
                          style={{
                            top: popupPosition.top,
                            left: popupPosition.left,
                          }}
                        >
                          <span className="popupText">Added to cart</span>
                          <span className="checkmark">&#10003;</span>
                        </div>
                      )}
                      <button className="deleteButton" onClick={() => handleRemove(menuItem)}>
                        Remove
                      </button>
                    </div>
                    {(cartItems.filter((item) => item.food_id === menuItem.food_id).length) == 0 ? 
                    <div className="itemCounter"> </div>
                    :
                     <div className="itemCounter">
                     Quantity: {cartItems.filter((item) => item.food_id === menuItem.food_id).length}
                     </div>
                    }
                   
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Order;
