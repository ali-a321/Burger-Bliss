import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddCategoryPopup({ showPopup, setShowPopup, handleAddCategory }) {
  const [newItem, setNewItem] = useState({ category_name: '', });
  const [categoryNames, setCategoryNames] = useState([]);
  const [errors, setErrors] = useState({
    category_name: '',
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
      category_name: '',
    })
    setShowPopup(false)
   
  }
  const validateForm = () => {
    const newErrors = {};

    if (!newItem.category_name) {
      newErrors.food_name = 'Please enter a category name';
    }
    return newErrors;
  };
  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      handleAddCategory(newItem);
      setNewItem({ category_name: '' });
      setShowPopup(false);

    } else {
      setErrors(newErrors);
    }
  };
 

  return (
    showPopup && (
      <div className="popup">
        <h2>Add New Category</h2>
        <input
          type="text"
          placeholder="Category Name"
          value={newItem.category_name}
          onChange={(e) => setNewItem({ ...newItem, category_name: e.target.value })}
        />
        {errors.food_name && <p className="error">{errors.food_name}</p>}
       
        {errors.category_name && <p className="error">{errors.category_name}</p>}
        <div className='btnContainer'> 
          <button onClick={handleSubmit}>Add</button>
          <button onClick={() => clearErrorForm()}>Cancel</button>
        </div>
      </div>
    )
  );
}

export default AddCategoryPopup;