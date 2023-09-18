const db = require('../db');
const axios = require('axios');

//POST /burger/category/add
const addCategory = async (req, res) => {
    try {
      const { category_name } = req.body;
  
      // Check if the category_name is empty
      if (!category_name) {
        return res.status(400).json({ message: 'Category name is required' });
      }
  
      // Insert the category into the categories table
      const insertQuery = 'INSERT INTO categories (category_name) VALUES (?)';
      db.query(insertQuery, [category_name], (error, results) => {
        if (error) {
          console.error('Error adding category:', error);
          return res.status(500).json({ message: 'Failed to add category' });
        }
  
        return res.status(201).json({ message: 'Category added successfully' });
      });
    } catch (error) {
      console.error('Error adding category:', error);
      res.status(500).json({ message: 'Failed to add category' });
    }
  };

//GET /burger/category/get
const getCategories = async (req, res) => {
  try {
      const sql = 'SELECT * FROM categories';

      db.query(sql, (error, rows) => {
          if (error) {
              console.error('Error fetching categories:', error);
              return res.status(500).json({ message: 'Failed to fetch category data' });
          }

          res.status(200).json(rows);
      });
  } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({ message: 'Failed to fetch category data' });
  }
};

//GET /burger/category/get/:id
const getCategory = async (req, res) => {
    try {
        const { id } = req.params; // Change parameter name to 'id'
        const query = 'SELECT * FROM menu WHERE category_id = ?';
        db.query(query, [id], (error, rows) => {
            if (error) {
                console.error('Error fetching menu:', error);
                return res.status(500).json({ message: 'Failed to fetch menu data' });
            }
            res.status(200).json(rows);
        });
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).json({ message: 'Failed to fetch menu data' });
    }
};

//DELETE /burger/category/delete/:id
const deleteCategory = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Check if the category exists
      const checkQuery = 'SELECT * FROM categories WHERE category_id = ?';
      db.query(checkQuery, [id], (checkError, checkResults) => {
        if (checkError) {
          console.error('Error checking category:', checkError);
          return res.status(500).json({ message: 'Failed to delete category' });
        }
  
        if (checkResults.length === 0) {
          return res.status(404).json({ message: 'Category not found' });
        }
  
        // Delete the category
        const deleteQuery = 'DELETE FROM categories WHERE category_id = ?';
        db.query(deleteQuery, [id], (deleteError, deleteResult) => {
          if (deleteError) {
            console.error('Error deleting category:', deleteError);
            return res.status(500).json({ message: 'Failed to delete category' });
          }
  
          return res.status(200).json({ message: 'Category deleted successfully' });
        });
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: 'Failed to delete category' });
    }
  };

// PUT /burger/category/put/:id
const modifyCategory = async (req, res) => {
  const { id } = req.params;
  const { category_name } = req.body;

  if (!category_name) {
      return res.status(400).json({ message: 'Category name is required' });
  }

  try {
      const sql = 'UPDATE categories SET category_name = ? WHERE category_id = ?';
      const values = [category_name, id];

      db.query(sql, values, (error, result) => {
          if (error) {
              console.error('Error modifying category:', error);
              return res.status(500).json({ message: 'Failed to modify category' });
          }

          if (result.affectedRows === 0) {
              // No rows were updated, so the category with the specified ID doesn't exist
              return res.status(404).json({ message: 'Category not found' });
          }

          res.status(200).json({ message: 'Category modified successfully' });
      });
  } catch (error) {
      console.error('Error modifying category:', error);
      res.status(500).json({ message: 'Failed to modify category' });
  }
};



module.exports = {addCategory, getCategory, deleteCategory, modifyCategory, getCategories};