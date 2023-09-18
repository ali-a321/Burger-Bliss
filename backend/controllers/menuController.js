const db = require('../db');
const axios = require('axios');

//POST /burger/menu/add
const addMenu = async (req, res) => {
    try {
        const { food_name, price, descriptions, food_picture, category_name } = req.body;
        if (!food_name || !price || !descriptions || !category_name) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find the category_id based on category_name
        const getCategorySQL = 'SELECT category_id FROM categories WHERE category_name = ?';

        db.query(getCategorySQL, [category_name], (error, rows) => {
            if (error) {
                console.error('Error finding category ID:', error);
                return res.status(500).json({ message: 'Failed to find category ID' });
            }

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Category not found' });
            }

            const category_id = rows[0].category_id;

            const insertMenuSQL = 'INSERT INTO menu (food_name, price, descriptions, food_picture, category_id) VALUES (?, ?, ?, ?, ?)';

            db.query(insertMenuSQL, [food_name, price, descriptions, food_picture, category_id], (insertError, results) => {
                if (insertError) {
                    console.error('Error adding menu item:', insertError);
                    return res.status(500).json({ message: 'Failed to add menu item' });
                }

                // Check if the insertion was successful
                if (results.affectedRows === 1) {
                    res.status(201).json({ message: 'Menu item added successfully' });
                } else {
                    res.status(500).json({ message: 'Failed to add menu item' });
                }
            });
        });
    } catch (error) {
        console.error('Error adding menu item:', error);
        res.status(500).json({ message: 'Failed to add menu item' });
    }
};


//GET /burger/menu/get
const getMenu = async (req, res) => {
    try {
        const sql = `
     SELECT m.food_id, m.food_name, m.price, m.descriptions, m.food_picture, c.category_name
        FROM menu AS m
        JOIN categories AS c ON m.category_id = c.category_id
        ORDER BY
          FIELD(c.category_name, 'Burgers', 'Sandwiches', 'Sides') DESC,
          FIELD(m.food_id, 16, 17, 18) DESC,
          c.category_name ASC,
          CASE WHEN c.category_name = 'Milkshakes' THEN 1 ELSE 2 END, -- Sort 'Milkshakes' last
          m.food_name ASC;


        `;

        db.query(sql, (error, rows) => {
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
//DELETE /burger/menu/delete/:id
const deleteMenu = async (req, res) => {
    const { id } = req.params;

    try {
        const sql = 'DELETE FROM menu WHERE food_id = ?';

        db.query(sql, [id], (error, result) => {
            if (error) {
                console.error('Error deleting menu item:', error);
                return res.status(500).json({ message: 'Failed to delete menu item' });
            }

            if (result.affectedRows === 0) {
                // No rows were deleted, so the menu item with the specified ID doesn't exist
                return res.status(404).json({ message: 'Menu item not found' });
            }

            res.status(200).json({ message: 'Menu item deleted successfully' });
        });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({ message: 'Failed to delete menu item' });
    }
};

//PUT /burger/menu/put/:id
const modifyMenu = async (req, res) => {
    const { id } = req.params;
    const { food_name, price, descriptions, food_picture, category_name } = req.body;

    if (!food_name || !price || !descriptions || !category_name) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Find the category_id based on category_name
    const getCategorySQL = 'SELECT category_id FROM categories WHERE category_name = ?';

    db.query(getCategorySQL, [category_name], (error, rows) => {
        if (error) {
            console.error('Error finding category ID:', error);
            return res.status(500).json({ message: 'Failed to find category ID' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const category_id = rows[0].category_id;

        try {
            const updateMenuSQL = 'UPDATE menu SET food_name = ?, price = ?, descriptions = ?, food_picture = ?, category_id = ? WHERE food_id = ?';
            const values = [food_name, price, descriptions, food_picture, category_id, id];

            db.query(updateMenuSQL, values, (updateError, result) => {
                if (updateError) {
                    console.error('Error modifying menu item:', updateError);
                    return res.status(500).json({ message: 'Failed to modify menu item' });
                }

                if (result.affectedRows === 0) {
                    // No rows were updated, so the menu item with the specified ID doesn't exist
                    return res.status(404).json({ message: 'Menu item not found' });
                }

                res.status(200).json({ message: 'Menu item modified successfully' });
            });
        } catch (updateError) {
            console.error('Error modifying menu item:', updateError);
            res.status(500).json({ message: 'Failed to modify menu item' });
        }
    });
};

module.exports = { addMenu, getMenu, deleteMenu, modifyMenu };
