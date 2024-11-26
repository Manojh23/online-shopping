// Import Dependencies
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config(); // For environment variables

// Initialize Express App
const app = express();

// Middleware
app.use(express.json()); // Built-in middleware for parsing JSON
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend's URL in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(morgan('dev')); // HTTP request logger

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Manoj@2003', // Replace with your MySQL password
  database: process.env.DB_NAME || 'inventory_db',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    process.exit(1); // Exit if there's a connection error
  }
  console.log('MySQL connected');
});

// =====================
// CRUD Routes
// =====================

// Get All Items
app.get('/api/items', (req, res) => {
  const sql = 'SELECT * FROM items';
  console.log('Fetching all items...');

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching items:', err.message);
      return res.status(500).json({ error: 'Server Error: Unable to fetch items.' });
    }

    console.log(`Fetched ${result.length} items`);
    res.json(result);
  });
});

// Get Items by Category
app.get('/api/items/category/:category', (req, res) => {
  const { category } = req.params;
  const sql = 'SELECT * FROM items WHERE category = ?';
  console.log(`Fetching items in category: ${category}`);

  db.query(sql, [category], (err, result) => {
    if (err) {
      console.error(`Error fetching items in category ${category}:`, err.message);
      return res.status(500).json({ error: `Server Error: Unable to fetch items in category ${category}.` });
    }

    console.log(`Fetched ${result.length} items in category ${category}`);
    res.json(result);
  });
});

// Add New Item
app.post('/api/items', (req, res) => {
  const newItem = req.body;

  // Validate Required Fields
  const { name, quantity, price, category, image_url } = newItem;
  if (!name || quantity == null || price == null || !category || !image_url) {
    console.error('Missing required fields:', newItem);
    return res.status(400).json({ error: 'Missing required fields: name, quantity, price, category, image_url.' });
  }

  console.log('Adding new item:', newItem);
  const sql = 'INSERT INTO items SET ?';

  db.query(sql, newItem, (err, result) => {
    if (err) {
      console.error('Error adding item:', err.message);
      return res.status(500).json({ error: 'Server Error: Unable to add item.' });
    }

    console.log('Item added with ID:', result.insertId);
    res.status(201).json({ id: result.insertId, ...newItem });
  });
});

// Update Item
app.put('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const updatedItem = req.body;

  // Validate Required Fields
  const { name, quantity, price, category, image_url } = updatedItem;
  if (!name || quantity == null || price == null || !category || !image_url) {
    console.error('Missing required fields for update:', updatedItem);
    return res.status(400).json({ error: 'Missing required fields: name, quantity, price, category, image_url.' });
  }

  console.log(`Updating item with ID ${id}:`, updatedItem);
  const sql = 'UPDATE items SET ? WHERE id = ?';

  db.query(sql, [updatedItem, id], (err, result) => {
    if (err) {
      console.error('Error updating item:', err.message);
      return res.status(500).json({ error: 'Server Error: Unable to update item.' });
    }

    if (result.affectedRows === 0) {
      console.warn(`No item found with ID ${id} to update.`);
      return res.status(404).json({ error: `Item with ID ${id} not found.` });
    }

    console.log(`Item with ID ${id} updated`);
    res.json({ message: 'Item updated successfully.' });
  });
});

// Delete Item
app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  console.log(`Deleting item with ID ${id}`);
  const sql = 'DELETE FROM items WHERE id = ?';

  db.query(sql, id, (err, result) => {
    if (err) {
      console.error('Error deleting item:', err.message);
      return res.status(500).json({ error: 'Server Error: Unable to delete item.' });
    }

    if (result.affectedRows === 0) {
      console.warn(`No item found with ID ${id} to delete.`);
      return res.status(404).json({ error: `Item with ID ${id} not found.` });
    }

    console.log(`Item with ID ${id} deleted`);
    res.json({ message: 'Item deleted successfully.' });
  });
});

// =====================
// Checkout Route
// =====================

// Handle Checkout
app.post('/api/checkout', (req, res) => {
  const { orderItems } = req.body;

  if (!orderItems || !Array.isArray(orderItems)) {
    return res.status(400).json({ success: false, message: 'Invalid order items.' });
  }

  // Begin Transaction
  db.beginTransaction(err => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ success: false, error: 'Server Error: Unable to process checkout.' });
    }

    // Function to Update Each Item's Quantity
    const updateItem = (item, callback) => {
      const sql = 'UPDATE items SET quantity = quantity - ? WHERE id = ? AND quantity >= ?';
      db.query(sql, [item.quantity, item.id, item.quantity], (err, result) => {
        if (err) {
          return callback(err);
        }
        if (result.affectedRows === 0) {
          return callback(new Error(`Insufficient stock for item ID ${item.id}.`));
        }
        callback(null);
      });
    };

    // Iterate Over Order Items
    let completed = 0;
    for (let item of orderItems) {
      updateItem(item, (err) => {
        if (err) {
          return db.rollback(() => {
            console.error('Error updating item:', err.message);
            res.status(400).json({ success: false, message: err.message });
          });
        }

        completed++;
        if (completed === orderItems.length) {
          // Commit Transaction
          db.commit(err => {
            if (err) {
              return db.rollback(() => {
                console.error('Error committing transaction:', err.message);
                res.status(500).json({ success: false, error: 'Server Error: Unable to complete checkout.' });
              });
            }
            console.log('Checkout successful');
            res.json({ success: true, message: 'Checkout successful.' });
          });
        }
      });
    }
  });
});

// =====================
// Start Server
// =====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
