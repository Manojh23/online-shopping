const mysql = require('mysql');

// MySQL connection setup (no database specified initially)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password', // replace with your MySQL password
});

// Connect to MySQL
db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected');
  
  // Create the database
  db.query('CREATE DATABASE IF NOT EXISTS inventory_db', (err, result) => {
    if (err) throw err;
    console.log('Database created or already exists');

    // Switch to the newly created database
    db.changeUser({ database: 'inventory_db' }, (err) => {
      if (err) throw err;

      // Create the items table
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100),
          quantity INT,
          price DECIMAL(10, 2)
        )
      `;
      db.query(createTableQuery, (err, result) => {
        if (err) throw err;
        console.log('Items table created or already exists');
        
        // Close the connection after setup is complete
        db.end();
      });
    });
  });
});
