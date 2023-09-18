const db = require('../db');
const axios = require('axios');
const nodemailer = require('nodemailer');

//POST /burger/order/add
const addOrder = async (req, res, io) => {
    try {
        const { customer_name, email, phone_number, order_details, payment_method, total, pickup_date, extra_notes, fulfilled } = req.body;
        if (!customer_name || !email || !phone_number || !order_details || !payment_method || !total) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }
    

        // Store the order in the database
        const insertOrderSQL = 'INSERT INTO orders (customer_name, email, phone_number, order_details, payment_method, total, pickup_date, extra_notes, fulfilled) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)';
        const values = [customer_name, email, phone_number, JSON.stringify(order_details), payment_method, total, pickup_date, extra_notes, fulfilled];

        db.query(insertOrderSQL, values, (insertError, results) => {
            if (insertError) {
                console.error('Error adding order:', insertError);
                return res.status(500).json({ message: 'Failed to add the order' });
            }

            // Check if the insertion was successful
            if (results.affectedRows === 1) {
                // After creating the order and saving it to the database
                io.emit('newOrder'); // Emit the "newOrder" event to all connected clients
                
                res.status(201).json({ message: 'Order added successfully' });
                //Email
                try {
                    const transporter = nodemailer.createTransport({
                      service: 'hotmail',
                      auth: {
                        user: 'burgerblissorders@outlook.com',
                        pass: process.env.OUTLOOK_PASSWORD,
                      },
                    });
                
                    const orderDetailsHTML = order_details
                    .map((item) => {
                      let foodPictureHTML = '';
                      if (item.food_picture) {
                        // Check if item.food_picture is not empty
                        foodPictureHTML = `
                          <div>
                            <img src="${item.food_picture}" alt="Food Image" style="width: 100px; height: 150px;">
                          </div>
                        `;
                      }
                      return `
                        <div style="display: flex; align-items: center; margin-bottom: 20px;">
                          ${foodPictureHTML}
                          <div style="margin-left: 20px;">
                            <p> ${item.food_name}</p>
                            <p>Quantity: ${item.count}</p>
                            <p>Price per: $${item.price}</p>
                          </div>
                        </div>
                      `;
                    })
                    .join('');
                    const formattedTotal = total.toFixed(2)
                    const formattedPickupDate = convertTo12HourFormat(pickup_date);

                    const mailOptions = {
                      from: 'burgerblissorders@outlook.com',
                      to: email,
                      subject: 'Order Confirmation: Burger Bliss',
                      html: `
                        <h4> Dear ${customer_name}, </h4>
                        <p>Thank you for placing an order with Burger Bliss! Here are your order details:</p>
                        ${orderDetailsHTML}
                        <p>${extra_notes ? `Extra Notes: ${extra_notes}` : ''}</p>
                        <p><strong>Total Order: $${formattedTotal}</strong></p>
                        <p><strong>Pick-up Time: ${formattedPickupDate} </strong></p>
                        <p>Thank you for enjoying your meal with us!</p>
                      `,
                    };
                
                    transporter.sendMail(mailOptions, (error, info) => {
                      if (error) {
                        console.error(error);
                        res.status(500).json({ error: 'Error sending email' });
                      } else {
                        //console.log('Email sent: ' + info.response);
                        res.json({ message: 'Email sent successfully' });
                      }
                    });
                  } catch (error) {
                    console.error(error);
                    res.status(500).json({ error: 'An error occurred' });
                  }
            } else {
                res.status(500).json({ message: 'Failed to add the order' });
            }
        });
    } catch (error) {
        console.error('Error adding order:', error);
        res.status(500).json({ message: 'Failed to add the order' });
    }
};
function convertTo12HourFormat(time24Hour) {
    const [hours, minutes] = time24Hour.split(':');
    let period = 'AM';
    let hours12Hour = parseInt(hours, 10);
  
    if (hours12Hour >= 12) {
      period = 'PM';
      if (hours12Hour > 12) {
        hours12Hour -= 12;
      }
    }
  
    return `${hours12Hour}:${minutes} ${period}`;
  }

//GET /burger/order/get
const getOrders = async (req, res) => {
    try {
        const sql = 'SELECT * FROM orders';

        db.query(sql, (error, rows) => {
            if (error) {
                console.error('Error fetching orders:', error);
                return res.status(500).json({ message: 'Failed to fetch order data' });
            }

            res.status(200).json(rows);
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch order data' });
    }
};

//GET unfulfilled orders, /burger/order/get/unfulfilled
const getUnfulfilledOrders = async (req, res) => {
    try {
        const sql = "SELECT * FROM orders WHERE fulfilled = 'false' ORDER BY order_date DESC ";

        db.query(sql, (error, rows) => {
            if (error) {
                console.error('Error fetching orders:', error);
                return res.status(500).json({ message: 'Failed to fetch order data' });
            }

            res.status(200).json(rows);
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch order data' });
    }
};
//PUT /burger/order/put/:id
const modifyOrder = async (req, res) => {
    const { id } = req.params;
    const { fulfilled } = req.body;

    if (fulfilled === undefined) {
        return res.status(400).json({ message: 'The "fulfilled" field must be provided' });
    }

    try {
        const updateOrderSQL = 'UPDATE orders SET fulfilled = ? WHERE order_id = ?';

        db.query(updateOrderSQL, [fulfilled, id], (updateError, result) => {
            if (updateError) {
                console.error('Error modifying order:', updateError);
                return res.status(500).json({ message: 'Failed to modify the order' });
            }

            if (result.affectedRows === 0) {
                // No rows were updated, so the order with the specified ID doesn't exist
                return res.status(404).json({ message: 'Order not found' });
            }

            res.status(200).json({ message: 'Order modified successfully' });
        });
    } catch (updateError) {
        console.error('Error modifying order:', updateError);
        res.status(500).json({ message: 'Failed to modify the order' });
    }
};

module.exports = { addOrder, getOrders, getUnfulfilledOrders, modifyOrder };