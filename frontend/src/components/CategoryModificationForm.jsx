import React, { useState } from 'react';
import axios from 'axios';

function CategoryModificationForm({ item, reloadCategory, setRenderLogin }) {
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [editedCategory, setEditedCategory] = useState({ ...item });

  const handleEdit = () => {
    setShowEditPopup(true);
  };

  const handleDelete = () => {
    setShowDeletePopup(true);
  };

  const handleCancelEdit = () => {
    setShowEditPopup(false);
  };

  const handleSaveEdit = () => {
    const token = localStorage.getItem('token');
    const { category_id, category_name } = editedCategory;

    axios
      .put(`http://localhost:8000/burger/category/put/${category_id}`, { category_name }, {
        withCredentials: true, 
      })
      .then((response) => {
        reloadCategory()
        setShowEditPopup(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setRenderLogin(true);
        } else {
          console.error('Error editing category:', error);
        }
      });
  };

  const handleConfirmDelete = () => {
    const token = localStorage.getItem('token');
    const { category_id } = item;

    axios
      .delete(`http://localhost:8000/burger/category/delete/${category_id}`, {
        withCredentials: true, 
      })
      .then((response) => {
        reloadCategory()
        setShowDeletePopup(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setRenderLogin(true);
        } else {
          console.error('Error deleting category', error);
        }
      });
  };

  return (
    <div>
     <div className='burgerInfo'> 
      <div className='burgerDescription'>{item.category_name}</div>
      <div className='burgerButtons'>
        <button className='editButton' onClick={handleEdit}>
          Edit
        </button>
        <button className='deleteButton' onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
      {showEditPopup && (
        <div className='popup'>
          <input
            type='text'
            value={editedCategory.category_name}
            onChange={(e) => setEditedCategory({ ...editedCategory, category_name: e.target.value })}
          />
          <div className='btnContainer'> 
            <button onClick={handleSaveEdit}>Save</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </div>
        </div>
      )}

      {showDeletePopup && (
        <div className='popup'>
          <p>Are you sure you want to delete {item.category_name} from the menu? Please note, all food items in {item.category_name} must be deleted in the "Manage Menu" tab first before {item.category_name} category is able to be deleted. </p>
          <button onClick={handleConfirmDelete}>Confirm</button>
          <button onClick={() => setShowDeletePopup(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default CategoryModificationForm;
