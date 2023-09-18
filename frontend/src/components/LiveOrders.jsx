import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import checkmark from "../images/check.svg"
import socket from '../services/socketService'; 
import notificationSounds from "../images/orderNotification.mp3"
import OrderCheckbox from './OrderCheckbox';
import OrderPopup from './OrderPopup';
import { checkTokenExpiration } from '../services/tokenService';

function LiveOrders({setRenderLogin }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [empty, setEmpty] = useState("");
  const notificationSoundRef = useRef(null);
 
  useEffect(() => {
    const tokenValid = checkTokenExpiration();    
    if (tokenValid) {
      setRenderLogin(false);
    } else {
      setRenderLogin(true);
    }
  }, []);
  
  useEffect(() => {
    notificationSoundRef.current = document.getElementById("notificationSound");
  }, []);

  useEffect(() => {
    getOrders();
  }, []);
  useEffect(() => {
    socket.on('newOrder', () => {
      getOrders();
      if (notificationSoundRef.current) {
        notificationSoundRef.current.play();
      }
    });
    return () => {
      socket.off('newOrder'); 
    };
  }, []);
  

  const getOrders = () => {
    axios
  .get('http://localhost:8000/burger/order/get/unfulfilled', {
    withCredentials: true, 
  })
  .then((response) => {
        // Initialize an array to store all orders with parsed order_details
        const allOrdersWithParsedDetails = response.data.map((order) => {
          // Parse the order_details field using JSON.parse
          const parsedOrderDetails = JSON.parse(order.order_details);

          // Create a new object that includes the parsed order_details
          return {
            ...order,
            order_details: parsedOrderDetails,
          };
        });

        setOrders(allOrdersWithParsedDetails);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setRenderLogin(true);
        } else {
          console.error('Error:', error);
        }
      });
  };

  const markFulfilled = (orderId) => {
    const checkbox = document.getElementById(`fulfilled-checkbox-${orderId}`);
    
    if (checkbox.checked) {
      axios
        .put(`http://localhost:8000/burger/order/put/${orderId}`, { fulfilled: "true" }, {
          withCredentials: true,
        })
        .then((response) => {
          getOrders();
          closePopup();
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            setRenderLogin(true);
          } else {
            console.error('Error marking order complete:', error);
          }
        });
    } else {
      setEmpty("Please check the checkbox to mark the order as fulfilled.")
    }
  };

  const closePopup = () => {
      setSelectedOrderId(null)
  };
const convertDate = (pickupTime) => {
  // Split the time into hours and minutes
  const [hours, minutes] = pickupTime.split(':');

  // Convert hours to a number
  const hoursNum = parseInt(hours, 10);

  const period = hoursNum >= 12 ? 'PM' : 'AM';

  const hours12hr = hoursNum % 12 || 12;

  const time12hr = `${hours12hr}:${minutes} ${period}`;

  return time12hr;
}


  return (
    <div className='liveOrderLayout'>
      <audio id="notificationSound" autoPlay={false} controls={false}>
        <source src={notificationSounds} type="audio/mp3" />
      </audio>
      {orders.map((order) => (
        <div className='liveOrderContainer' key={order.order_id}> 
         <img
            src={checkmark}
            alt='checkmark'
            className='checkMark'
            onClick={() => setSelectedOrderId(order.order_id)}
          />
         <div className='center'> 
          <OrderPopup order = {order}/>
          </div>
          <div className='orderName'> Name: {order.customer_name} - <span className='foodName'> Phone: {order.phone_number} </span> </div>
         

          {order.order_details.map((item, index) => (
            <div key={index}>
              <span className='count'> {item.count} </span> <span className='foodName'> {item.food_name} </span>
            </div>
          ))}
          {order.extra_notes ?  <div className='extraNotes'> Extra Notes: {order.extra_notes}</div> : ""}   
          <div className='orderTotal'> Payment: {order.payment_method}</div>
          <div className='orderTotal'> Total: ${order.total}</div>
          <div className='orderpickupTime'> Pick-up Time: {convertDate(order.pickup_date)} </div>
          <OrderCheckbox/>
          
          {selectedOrderId === order.order_id && (
            <div className='fulfillment-popup'>
              <div className='fulfillment-popup-content'>
                <p>Pick Up Complete?</p>
                <input type='checkbox' id={`fulfilled-checkbox-${order.order_id}`} className='checkboxfill' required />
                {empty ? <div className='emptyCheck'>Please check the checkbox to mark the order as fulfilled before submitting. </div> : ""}
                <div className='fullbtnContainer'> 
                  <button className='fulfillment-popup-button' onClick={() => markFulfilled(order.order_id)}>Submit</button>
                  <button className='fulfillment-popup-button' onClick={() => setSelectedOrderId(null)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default LiveOrders;
