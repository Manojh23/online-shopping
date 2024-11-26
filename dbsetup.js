const mysql = require('mysql');

// MySQL connection setup (no database specified initially)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Manoj@2003', // replace with your MySQL password
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    process.exit(1);
  }
  console.log('MySQL connected');

  // Create the database
  db.query('CREATE DATABASE IF NOT EXISTS inventory_db', (err, result) => {
    if (err) {
      console.error('Error creating database:', err.message);
      process.exit(1);
    }
    console.log('Database created or already exists');

    // Switch to the newly created database
    db.changeUser({ database: 'inventory_db' }, (err) => {
      if (err) {
        console.error('Error switching to database:', err.message);
        process.exit(1);
      }

      // Create the items table with additional fields
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          quantity INT NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          category VARCHAR(50) NOT NULL,
          image_url VARCHAR(255) NOT NULL
        )
      `;
      db.query(createTableQuery, (err, result) => {
        if (err) {
          console.error('Error creating items table:', err.message);
          process.exit(1);
        }
        console.log('Items table created or already exists');

        // Insert sample data (optional)
        const sampleData = [
          {
            name: 'Men T-Shirt',
            quantity: 50,
            price: 19.99,
            category: 'Men',
            image_url: 'https://via.placeholder.com/150',
          },
          {
            name: 'Women Dress',
            quantity: 30,
            price: 49.99,
            category: 'Women',
            image_url: 'https://via.placeholder.com/150',
          },
          {
            name: 'Kids Shorts',
            quantity: 20,
            price: 14.99,
            category: 'Kids',
            image_url: 'https://via.placeholder.com/150',
          },
        ];

        const insertQuery = 'INSERT INTO items (name, quantity, price, category, image_url) VALUES ?';
        const values = sampleData.map(item => [item.name, item.quantity, item.price, item.category, item.image_url]);

        db.query(insertQuery, [values], (err, result) => {
          if (err) {
            console.error('Error inserting sample data:', err.message);
            process.exit(1);
          }
          console.log('Sample data inserted successfully');
          
          // Close the connection after setup is complete
          db.end((err) => {
            if (err) {
              console.error('Error closing the connection:', err.message);
            }
            console.log('MySQL connection closed');
          });
        });
      });
    });
  });
});
