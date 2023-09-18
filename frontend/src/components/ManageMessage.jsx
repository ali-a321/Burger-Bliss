import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { checkTokenExpiration } from '../services/tokenService';

function ManageMessage({setRenderLogin}) {

    const [messageData, setMessageData] = useState([])

    useEffect(() => {
        const tokenValid = checkTokenExpiration();    
        if (tokenValid) {
          setRenderLogin(false);
        } else {
          setRenderLogin(true);
        }
      }, []);
      useEffect(() => {
        reloadMessages();
      }, []);
      
      const reloadMessages = () => {
        axios
          .get('http://localhost:8000/burger/contact/get', {
            withCredentials: true,
          })
          .then((response) => {
            setMessageData(response.data);
          })
          .catch((error) => {
            console.error('Error fetching menu data:', error);
          });
      };
      const handleDeleteMessage = (id) => {
        axios
          .delete(`http://localhost:8000/burger/contact/delete/${id}`, {
            withCredentials: true,
          })
          .then((response) => {
            console.log('Message deleted successfully');
            reloadMessages();
          })
          .catch((error) => {
            console.error('Error deleting message:', error);
          });
      };
      
      return (
        <div>
          <div className='manageMessageBox'>
            {messageData.map((item) => (
              <div key={item.id}>
                <div className='contactName'>Name: {item.name}</div>
                <div className='contactEmail'>Email: {item.email}</div>
                <div className='contactMessage'>Message: {item.message}</div>
                <button onClick={() => handleDeleteMessage(item.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      );
    }
export default ManageMessage