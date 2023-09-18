const db = require('../db');

// POST /burger/contact/add
const addMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const insertQuery = 'INSERT INTO contact (name, email, message) VALUES (?, ?, ?)';
    db.query(insertQuery, [name, email, message], (error, results) => {
      if (error) {
        console.error('Error adding customer feedback:', error);
        return res.status(500).json({ message: 'Failed to save message' });
      }

      res.status(201).json({ message: 'Customer feedback added successfully' });
    });
  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).json({ message: 'Failed to add customer feedback' });
  }
};

// GET /burger/contact/get
const getMessages = async (req, res) => {
  try {
    const sql = 'SELECT * FROM contact ORDER BY id DESC';

    db.query(sql, (error, rows) => {
      if (error) {
        console.error('Error fetching customer feedback:', error);
        return res.status(500).json({ message: 'Failed to fetch customer feedback' });
      }

      res.status(200).json(rows);
    });
  } catch (error) {
    console.error('Error fetching customer feedback:', error);
    res.status(500).json({ message: 'Failed to fetch customer feedback' });
  }
};

// DELETE /burger/contact/delete/:id
const deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const checkQuery = 'SELECT * FROM contact WHERE id = ?';
    db.query(checkQuery, [id], (checkError, checkResults) => {
      if (checkError) {
        console.error('Error checking:', checkError);
        return res.status(500).json({ message: 'Failed to delete customer feedback' });
      }

      if (checkResults.length === 0) {
        return res.status(404).json({ message: 'Customer message not found' });
      }

      // Delete the message
      const deleteQuery = 'DELETE FROM contact WHERE id = ?';
      db.query(deleteQuery, [id], (deleteError, deleteResult) => {
        if (deleteError) {
          console.error('Error deleting message:', deleteError);
          return res.status(500).json({ message: 'Failed to delete message' });
        }

        res.status(200).json({ message: 'Message deleted successfully' });
      });
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Failed to delete message' });
  }
};

module.exports = { addMessage, getMessages, deleteMessage };
