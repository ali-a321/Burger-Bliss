import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FoodModificationForm({ foodItem, reloadMenu, setFilteredMenuData, setRenderLogin }) {
  
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [editedBurger, setEditedBurger] = useState({ ...foodItem });
    const [categoryNames, setCategoryNames] = useState([]);
    const handleEdit = () => {
      setShowEditPopup(true);
    };
  
    const handleDelete = () => {
      setShowDeletePopup(true);
    };
  
    const handleCancelEdit = () => {
      setShowEditPopup(false);
      setEditedBurger({ ...foodItem });
    };
  
    useEffect(() => {
      axios
        .get('http://localhost:8000/burger/category/get')
        .then((response) => {
          const categories = response.data;
          const categoryNames = categories.map((category) => category.category_name);
          setCategoryNames(categoryNames);
        })
        .catch((error) => {
          console.error('Error fetching category names:', error);
        });
    }, []);
    const handleSaveEdit = (setFilteredMenuData) => {
    
        axios
            .put(`http://localhost:8000/burger/menu/put/${editedBurger.food_id}`, editedBurger, {
              withCredentials: true, 
            })
            .then((response) => {
            setFilteredMenuData([editedBurger])
            reloadMenu()
            setShowEditPopup(false);
            })
            .catch((error) => {
              if (error.response && error.response.status === 401) {
                setRenderLogin(true);
              } else {
                console.error('Error adding food item:', error);
              }
            });
    };

    const handleConfirmDelete = (id, setFilteredMenuData) => {
      axios
          .delete(`http://localhost:8000/burger/menu/delete/${id}`, {
            withCredentials: true, 
          })
          .then((response) => {
              setFilteredMenuData([])
              reloadMenu()
              setShowDeletePopup(false);
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              setRenderLogin(true);
            } else {
              console.error('Error deleting item:', error);
            }
          });
    };
  
    return (
      <div className='burgerInfo'>
        <div className='burgerTitle'>{foodItem.food_name}</div>
        {foodItem.food_picture && (
          <img src={foodItem.food_picture} className='burgerPicture' alt={foodItem.food_name} />
        )}
         <div className='burgerDescription'>{foodItem.descriptions}</div>
        <div className='burgerPrice'>${foodItem.price}</div>
        <div className='burgerButtons'>
          <button className='editButton' onClick={handleEdit}>
            Edit
          </button>
          <button className='deleteButton' onClick={handleDelete}>
            Delete
          </button>
        </div>
  
        {showEditPopup && (
          <div className='popup'>
            <input
              type='text'
              value={editedBurger.food_name}
              onChange={(e) => setEditedBurger({ ...editedBurger, food_name: e.target.value })}
            />
            <input
                type='text'
                value={editedBurger.food_picture}
                onChange={(e) => setEditedBurger({ ...editedBurger, food_picture: e.target.value })}
                placeholder='Picture URL'
            />
            <textarea
              value={editedBurger.descriptions}
              onChange={(e) => setEditedBurger({ ...editedBurger, descriptions: e.target.value })}
            />
            <input
              type='number'
              value={editedBurger.price}
              onChange={(e) => setEditedBurger({ ...editedBurger, price: e.target.value })}
            />
             <select
              value={editedBurger.category_name}
              onChange={(e) => setEditedBurger({ ...editedBurger, category_name: e.target.value })}
            >
              {categoryNames.map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
            
            <div className='btnContainer'> 
              <button onClick={() => handleSaveEdit(setFilteredMenuData)}>Save</button>
              <button onClick={handleCancelEdit}>Cancel</button>
            </div>
          </div>
        )}
  
        {showDeletePopup && (
          <div className='popup'>
            <p>Are you sure you want to delete {foodItem.food_name} from the menu?</p>
            <div className='btnContainer'>
              <button onClick={() => handleConfirmDelete(foodItem.food_id, setFilteredMenuData)} >Confirm</button>
              <button onClick={() => setShowDeletePopup(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    );
  }

export default FoodModificationForm