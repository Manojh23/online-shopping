const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password', // replace with your MySQL password
  database: 'inventory_db', // make sure this database exists
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected');
});

// CRUD routes
// Get all items
app.get('/api/items', (req, res) => {
  const sql = 'SELECT * FROM items';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Add new item
app.post('/api/items', (req, res) => {
  const newItem = req.body;
  const sql = 'INSERT INTO items SET ?';
  db.query(sql, newItem, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Update item
app.put('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const updatedItem = req.body;
  const sql = 'UPDATE items SET ? WHERE id = ?';
  db.query(sql, [updatedItem, id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Delete item
app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM items WHERE id = ?';
  db.query(sql, id, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
