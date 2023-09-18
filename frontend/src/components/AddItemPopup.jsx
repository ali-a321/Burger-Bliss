import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddItemPopup({ showPopup, setShowPopup, handleAddItem }) {
  const [newItem, setNewItem] = useState({ food_name: '', price: '', descriptions: '', category_name: '' });
  const [categoryNames, setCategoryNames] = useState([]);
  const [errors, setErrors] = useState({
    food_name: '',
    price: '',
    descriptions: '',
    category_name: ''
  });

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

  const clearErrorForm = () => {
    setErrors({
      food_name: '',
      price: '',
      descriptions: '',
      category_name: ''
    })
    setShowPopup(false)
  }
  const validateForm = () => {
    const newErrors = {};

    if (!newItem.food_name) {
      newErrors.food_name = 'Please enter a food name';
    }

    if (!newItem.price) {
      newErrors.price = 'Please enter a price';
    }

    if (!newItem.descriptions) {
      newErrors.descriptions = 'Please enter a description';
    }

    if (!newItem.category_name) {
      newErrors.category_name = 'Please select a category';
    }

    return newErrors;
  };
  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      handleAddItem(newItem);
      setNewItem({ food_name: '', price: '', descriptions: '', category_name: '' });
      setShowPopup(false);

    } else {
      setErrors(newErrors);
    }
  };
 

  return (
    showPopup && (
      <div className="popup">
        <h2>Add New Food Item</h2>
        <input
          type="text"
          placeholder="Food Name"
          value={newItem.food_name}
          onChange={(e) => setNewItem({ ...newItem, food_name: e.target.value })}
        />
        {errors.food_name && <p className="error">{errors.food_name}</p>}
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        {errors.price && <p className="error">{errors.price}</p>}
        <textarea
          placeholder="Description"
          value={newItem.descriptions}
          onChange={(e) => setNewItem({ ...newItem, descriptions: e.target.value })}
        />
        {errors.descriptions && <p className="error">{errors.descriptions}</p>}
        <select
          value={newItem.category_name}
          onChange={(e) => setNewItem({ ...newItem, category_name: e.target.value })}
        >
          <option value="">Selet a category </option>
          {categoryNames.map((categoryName) => (
            <option key={categoryName} value={categoryName}>
              {categoryName}
            </option>
          ))}
        </select>
        {errors.category_name && <p className="error">{errors.category_name}</p>}
        <div className='btnContainer'> 
          <button onClick={handleSubmit}>Add</button>
          <button onClick={() => clearErrorForm()}>Cancel</button>
        </div>
      </div>
    )
  );
}

export default AddItemPopup;