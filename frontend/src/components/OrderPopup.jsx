import React, { useState, useEffect } from 'react';


function OrderPopup({ order }) {
    const [showNewOrderMessage, setShowNewOrderMessage] = useState(false);
  
    useEffect(() => {
        const currentDate = new Date();
        const orderDate = new Date(order.order_date.replace(' ', 'T'));
        const timeDifference = currentDate - orderDate;
        
        if (timeDifference <= 600000) {
          // Calculate the remaining time in milliseconds
          const remainingTime = 600000 - timeDifference;
      
          setShowNewOrderMessage(true);
      
          const timer = setTimeout(() => {
            setShowNewOrderMessage(false);
          }, remainingTime);
      
          return () => clearTimeout(timer);
        }
      }, [order.order_date]);
  
    return (
      <div>
        {showNewOrderMessage ? (
          <div className="new-order-message">New Order!</div>
        ) : (
          ''
        )}
      </div>
    );
  }
  
  export default OrderPopup;