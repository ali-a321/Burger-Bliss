import React, {useEffect, useState} from 'react'
import axios from 'axios'
import CategoryModificationForm from './CategoryModificationForm';
import AddCategoryPopup from "./AddCategoryPopup";
import { checkTokenExpiration } from '../services/tokenService';
function ManageCategories( {setRenderLogin} ) {

  const [categoryData, setCategoryData] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  
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
      .get('http://localhost:8000/burger/category/get')
      .then((response) => {
        const categories = response.data;
        setCategoryData(categories)
        const categoryNames = categories.map((category) => category.category_name);
        setCategoryNames(categoryNames);
      })
      .catch((error) => {
        console.error('Error fetching category names:', error);
      });
  }, []);

  const handleAddCategory = (newItem) => {
    axios.post('http://localhost:8000/burger/category/add', newItem , {
      withCredentials: true, 
    })
      .then((response) => {
        reloadCategory()
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setRenderLogin(true);
        } else {
          console.error('Error adding new item:', error);
        }
      });
  };

  const reloadCategory = () => {
    axios
    .get('http://localhost:8000/burger/category/get')
    .then((response) => {
      setCategoryData(response.data);
    })
    .catch((error) => {
      console.error('Error fetching menu data:', error);
    });
  }

  return (
    <div className='blackBg'>
      <button className='addFoodBtn' onClick={() => setShowAddPopup(true)}>Add Category </button>
    
      <div className='burgerNameContainer'> 
       {categoryData.map((item) => (
        <CategoryModificationForm  key ={item.id} item = {item} reloadCategory={reloadCategory} setRenderLogin={setRenderLogin}/>
      ))}
      </div>
      <AddCategoryPopup showPopup={showAddPopup} setShowPopup={setShowAddPopup} handleAddCategory={handleAddCategory} />

    
    </div>
  )
}

export default ManageCategories