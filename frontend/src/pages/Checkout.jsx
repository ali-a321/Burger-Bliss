import React, { useState, useEffect  } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import io from 'socket.io-client';


function Checkout() {
  // Get cart items from local storage
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const [consolidatedCartItems, setConsolidatedCartItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [extraNotes, setExtraNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('store');
  const [pickupDate, setPickupDate] = useState('');
  const [fulfilled, setFulfilled] = useState("false");
  const [orderDate, setOrderDate] = useState("");

  const navigate = useNavigate()

  // Preprocess cart items to consolidate items with the same food_id
  const consolidateCartItems = (cartItems) => {
    return cartItems.reduce((acc, currentItem) => {
      const existingItem = acc.find((item) => item.food_id === currentItem.food_id);

      if (existingItem) {
        existingItem.count += currentItem.count;
      } else {
        // Create a new object without the extra key
        const newItem = {
          food_id: currentItem.food_id,
          food_name: currentItem.food_name,
          price: currentItem.price,
          descriptions: currentItem.descriptions,
          food_picture: currentItem.food_picture,
          count: currentItem.count,
        };
        acc.push(newItem);
      }
      return acc;
    }, []);
  };
  const sendOrderNotification = () => {
    const socket = io('http://localhost:8000'); 

    // Listen for the "newOrder" event
    socket.on('newOrder', () => {
      // Handle the event (e.g., show a notification)
      console.log("Notification sent")
    });
    return () => {
      socket.disconnect();
    };
  }
 
  useEffect(() => {
    const newConsolidatedCartItems = consolidateCartItems(cartItems);
    newConsolidatedCartItems.sort((a, b) => b.price - a.price); //To diplay based on price of individual item
    setConsolidatedCartItems(newConsolidatedCartItems);
  }, []);


  // Calculate total price
  const totalPrice = consolidatedCartItems.reduce(
    (total, item) => total + item.price * item.count,
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const order = {
      customer_name: customerName,
      email: email,
      phone_number: phoneNumber,
      order_details: consolidatedCartItems,
      payment_method: paymentMethod,
      total: totalPrice,
      pickup_date: convert12HourTo24Hour(pickupDate),
      extra_notes: extraNotes,
      fulfilled: fulfilled,
    };
    axios
      .post('http://localhost:8000/burger/order/add', order)
      .then((response) => {
        console.log('Order Data:', response.data); 
        sendOrderNotification()
        localStorage.removeItem('cartItems');
        localStorage.removeItem('cartCount');

        navigate("/");
      })
      .catch((error) => {
        console.error('Error creating order:', error);
      });
  };

  const handleQuantityChange = (foodId, quantity) => {
    const updatedItems = [...cartItems];
    updatedItems.sort((a, b) => b.price - a.price); //To diplay based on price of individual item

    const existingItems = updatedItems.filter((item) => item.food_id === foodId);
    const existingItemCount = existingItems.length;
  
    if (quantity > existingItemCount) {
      // Add more duplicates for the specified item
      const itemToDuplicate = updatedItems.find((item) => item.food_id === foodId);
      if (itemToDuplicate) {
        for (let i = 0; i < quantity - existingItemCount; i++) {
          updatedItems.push({ ...itemToDuplicate });
        }
      }
    } else if (quantity < existingItemCount) {
      // Remove duplicates for the specified item
      for (let i = 0; i < existingItemCount - quantity; i++) {
        const indexToRemove = updatedItems.findIndex((item) => item.food_id === foodId);
        if (indexToRemove !== -1) {
          updatedItems.splice(indexToRemove, 1);
        }
      }
    }
    const countLength = updatedItems.length
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    localStorage.setItem('cartCount', (countLength).toString());
    const combineCart = consolidateCartItems(updatedItems);
    console.log(combineCart)
    setConsolidatedCartItems(combineCart);
  };
  
  const handleRemove = (foodId) => {
    const updatedItems = cartItems.filter((item) => item.food_id !== foodId);
  
    // Update cart items in state
    console.log(updatedItems);
    const countLength = updatedItems.length
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    localStorage.setItem('cartCount', (countLength).toString());
    const combineCart = consolidateCartItems(updatedItems);
    setConsolidatedCartItems(combineCart);
    console.log(combineCart)


  };

  const generateTimeOptions = () => {
    const options = [];
    options.push( 
      <option key={-1} value="">
        Select a pickup time
      </option>
    );
    const interval = 15; 
    const currentTime = new Date();
  
    // Calculate the start time based on the current time
    const startTime = new Date(currentTime);
    startTime.setMinutes(Math.ceil(currentTime.getMinutes() / interval) * interval);
  
    for (let i = 0; i < 24 * 60 / interval; i++) {
      const time = new Date(startTime.getTime() + i * interval * 60 * 1000);
      const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      options.push(
        <option key={i} value={formattedTime}>
          {formattedTime}
        </option>
      );
    }
  
    return options;
  };

  const convert12HourTo24Hour = (time12Hour) => {
    const [time, period] = time12Hour.split(' ');
    const [hours, minutes] = time.split(':');
  
    let hours24 = parseInt(hours);
  
    if (period === 'PM' && hours24 !== 12) {
      hours24 += 12;
    } else if (period === 'AM' && hours24 === 12) {
      hours24 = 0;
    }
  
    const formattedTime24Hour = `${hours24.toString().padStart(2, '0')}:${minutes}`;
  
    return formattedTime24Hour;
  }

  const handlePhoneNumberChange = (e) => {
    const cleanedPhoneNumber = e.target.value.replace(/[^0-9-+]/g, '');
    setPhoneNumber(cleanedPhoneNumber);
  };

  return (
    <div>
      <Header />
      <div className='background'> 
      <div className='center'> 
      <div className="checkout-container">
        <div className="cart-summary">
          <h2>Cart Summary</h2>
          {consolidatedCartItems.map((item) => (
            <div className="cart-item" key={item.food_id}>
               {item.food_picture ? (
                <img
                  src={item.food_picture}
                  alt={item.food_name}
                  className="item-image"
                />
              ) : (
                <div className="item-image"></div>
                )}
              <div className="item-details">
                <h3>{item.food_name}</h3>
                <p>{item.descriptions}</p>
                <div className="item-quantity">
                  <span className='quantityBox'>Quantity:</span>
                  <select
                    value={item.count} 
                    onChange={(e) => {
                      handleQuantityChange(item.food_id, Number(e.target.value));
                    }}
                  >
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="item-total">
                <p>Total: ${item.price * item.count}</p>
              </div>
              <div className='item-remove' onClick={ () => handleRemove(item.food_id)}> Remove</div>
            </div>
          ))}
          <div className="order-total">
            <h3>Total Amount: ${(totalPrice).toFixed(2)}</h3>
          </div>
        </div>
        
      </div>
      </div>
      <div className='center'> 
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Checkout Information</h2>
          <label htmlFor="customerName"> Name:</label>
          <input
            type="text"
            id="customerName"
            maxLength={50}
            minLength={2}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
           <label htmlFor="customerName"> Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            maxLength={100}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
           <label htmlFor="phonenumber"> Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            maxLength={15}
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            required
          />
         
          <label htmlFor="paymentMethod">Payment Method:</label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          >
            <option value="store">In-Store Payment</option>
            <option value="online">Online Payment</option>
          </select>
          <label htmlFor="pickupDate">Pickup Time:</label>
          <select
            className='timesAvailable'
            id="pickupDate"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            required
          >
            {generateTimeOptions()}
          </select>
          <label htmlFor="extraNotes">Extra Notes:</label>
          <textarea
            id="extraNotes"
            value={extraNotes}
            maxLength={300}
            onChange={(e) => setExtraNotes(e.target.value)}
          ></textarea>
          <div className='center'> 
            <button className='submitBtn' type="submit">Place Order</button>
          </div>
        </form>
        </div>
        </div>
    </div>
  );
}

export default Checkout;
