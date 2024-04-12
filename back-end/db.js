// Import necessary modules
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

// Open a connection to the SQLite database file
const db = new sqlite3.Database('gklDatabase.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});
db.run(`CREATE TABLE IF NOT EXISTS carts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    productId INTEGER,
    quantity INTEGER,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (productId) REFERENCES products(id)
)`, (err) => {
    if (err) {
        console.error('Error creating carts table:', err.message);
    } else {
        console.log('Carts table already exists or was created successfully.');
    }
});

// Create products table
db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL,
    description TEXT,
    image TEXT,
    stars TEXT,
    onsale BOOLEAN
)`, (err) => {
    if (err) {
        console.error('Error creating products table:', err.message);
    } else {
        console.log('Products table already exists or was created successfully.');
    }
});
  
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    cardNumber TEXT,
    token TEXT
)`, (err) => {
    if (err) {
        console.error('Error creating users table:', err.message);
    } else {
        console.log('Users table already exists or was created successfully.');    }
});


// Function to insert a new product into the products table
module.exports.createProduct = (name, price, description, image, stars, callback) => {
    const sql = `INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)`;
    db.run(sql, [name, price, description, image, stars], function (err) {
        if (err) {
            callback(err);
        } else {
            // Return the ID of the newly inserted product
            callback(null, this.lastID);
        }
    });
};

// Function to get all products from the products table
module.exports.getAllProducts = (callback) => {
    const sql = `SELECT * FROM products;`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            callback(err);
        } else {
            callback(null, rows);
        }
    });
};

// Function to get a product by its ID from the products table
// Function to get a product by its ID from the products table
module.exports.getProductById = (id, callback) => {
    const sql = `SELECT * FROM products WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        if (err) {
            callback(err);
            return;
        }

        if (!row) {
            callback(new Error(`Product with ID ${id} not found`));
            return;
        }

        callback(null, row);
    });
};


// Function to update a product in the products table
module.exports.updateProduct = (productId, name, price, description, image, callback) => {
    const sql = `UPDATE products SET name = ?, price = ?, description = ?, image = ? WHERE id = ?`;
    db.run(sql, [name, price, description, image, productId], function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, this.changes); // Return the number of rows affected by the update
        }
    });
};

// Function to delete a product from the products table
module.exports.deleteProduct = (productId, callback) => {
    const sql = `DELETE FROM products WHERE id = ?`;
    db.run(sql, [productId], function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, this.changes); // Return the number of rows affected by the deletion
        }
    });
};
module.exports.createUserWithToken = (username, password, cardNumber, token, callback) => {
     // Generate a salt and hash for the password
     bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return callback(err);
        }
        const sql = `INSERT INTO users (username, password, cardNumber, token) VALUES (?, ?, ?, ?)`;
        db.run(sql, [username, hashedPassword, cardNumber, token], function (err) {
            if (err) {
                callback(err);
            } else {
                // Return the ID of the newly inserted user along with the token
                callback(null, { id: this.lastID, token });
            }
        });
    });
  };
  module.exports.findUserByUsername = (username, callback) => {
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.get(sql, [username], (err, row) => {
        if (err) {
            callback(err);
        } else {
            // If a user with the given username exists, return the user data
            // Otherwise, return null to indicate that the user does not exist
            callback(null, row);
        }
    });
};
module.exports.findUserByToken = (token, callback) => {
    const sql = `SELECT * FROM users WHERE token = ?`;
    db.get(sql, [token], (err, row) => {
        if (err) {
            callback(err);
        } else {
            // If a user with the given token exists, return the user data
            // Otherwise, return null to indicate that the user does not exist
            callback(null, row);
        }
    });
};
module.exports.updateUserToken = (userId, newToken, callback) => {
    const sql = 'UPDATE users SET token = ? WHERE id = ?';
    db.run(sql, [newToken, userId], (err) => {
        if (err) {
            // If an error occurs during the database operation, pass the error to the callback
            callback(err);
        } else {
            // If the update is successful, call the callback without any error
            callback(null);
        }
    });
};
module.exports.updateUserInfo = (username, newCardNumber, callback) => {
    const sql = `UPDATE users SET cardNumber = ? WHERE username = ?`;
    db.run(sql, [newCardNumber, username], (err) => {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
};
module.exports.addToCart = (userId, productId, quantity, callback) => {
    const sql = `INSERT INTO carts (userId, productId, quantity) VALUES (?, ?, ?)`;
    db.run(sql, [userId, productId, quantity], function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, this.lastID); // Return the ID of the newly inserted cart item
        }
    });
};

module.exports.getCartItems = (userId, callback) => {
    const sql = `SELECT p.*, c.quantity FROM carts c JOIN products p ON c.productId = p.id WHERE c.userId = ?`;
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            callback(err);
        } else {
            callback(null, rows);
        }
    });
};

module.exports.removeFromCart = (userId, productId, callback) => {
    const sql = `DELETE FROM carts WHERE userId = ? AND productId = ?`;
    db.run(sql, [userId, productId], function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, this.changes); // Return the number of rows affected by the deletion
        }
    });
};

// Function to get the count of items in the user's cart
module.exports.getCartItemCount = (userId, callback) => {
    const sql = `SELECT COUNT(*) AS count FROM carts WHERE userId = ?`;
    db.get(sql, [userId], (err, row) => {
        if (err) {
            callback(err);
            return;
        }
        const count = row ? row.count : 0; // If there are no rows (no items in cart), set count to 0
        callback(null, count);
    });
};



// Close the database connection
module.exports.closeDatabase = () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
};
