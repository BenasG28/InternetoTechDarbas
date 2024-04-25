const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

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
    FOREIGN KEY (productId) REFERENCES products(id),
    CONSTRAINT uc_cart UNIQUE (userId, productId)
)`, (err) => {
    if (err) {
        console.error('Error creating carts table:', err.message);
    } else {
        console.log('Carts table already exists or was created successfully.');
    }
});

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
    token TEXT,
    tokenExpiration INTEGER
)`, (err) => {
    if (err) {
        console.error('Error creating users table:', err.message);
    } else {
        console.log('Users table already exists or was created successfully.');    }
});


module.exports.createProduct = (name, price, description, image, stars, callback) => {
    const sql = `INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)`;
    db.run(sql, [name, price, description, image, stars], function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, this.lastID);
        }
    });
};

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

module.exports.updateProduct = (productId, name, price, description, image, callback) => {
    const sql = `UPDATE products SET name = ?, price = ?, description = ?, image = ? WHERE id = ?`;
    db.run(sql, [name, price, description, image, productId], function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, this.changes); 
        }
    });
};

module.exports.deleteProduct = (productId, callback) => {
    const sql = `DELETE FROM products WHERE id = ?`;
    db.run(sql, [productId], function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, this.changes);
        }
    });
};
module.exports.createUserWithToken = (username, password, cardNumber, token, tokenExpiration, callback) => {
     bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return callback(err);
        }
        const sql = `INSERT INTO users (username, password, cardNumber, token, tokenExpiration) VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [username, hashedPassword, cardNumber, token, tokenExpiration], function (err) {
            if (err) {
                callback(err);
            } else {
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
            callback(null, row);
        }
    });
};
module.exports.updateUserToken = (userId, newToken, tokenExpiration, callback) => {
    const sql = 'UPDATE users SET token = ?, tokenExpiration = ? WHERE id = ?';
    db.run(sql, [newToken, tokenExpiration, userId], (err) => {
        if (err) {
            callback(err);
        } else {
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
    const sql = `
        INSERT OR REPLACE INTO carts (userId, productId, quantity)
        VALUES (?, ?, COALESCE((SELECT quantity FROM carts WHERE userId = ? AND productId = ?), 0) + ?)`;
    db.run(sql, [userId, productId, userId, productId, quantity], function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, this.changes);
        }
    });
};



module.exports.getCartItems = (userId, callback) => {
    const sql = `SELECT p.*, c.quantity as totalQuantity
    FROM carts c
    JOIN products p ON c.productId = p.id
    WHERE c.userId = ?`;
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            callback(err);
        } else {
            callback(null, rows);
        }
    });
};

module.exports.removeFromCart = (userId, productId, callback) => {
    const updateSql = `UPDATE carts SET quantity = quantity - 1 WHERE userId = ? AND productId = ?`;
    db.run(updateSql, [userId, productId], function (err) {
        if (err) {
            callback(err);
        } else {
            const deleteSql = `DELETE FROM carts WHERE userId = ? AND productId = ? AND quantity = 0`;
            db.run(deleteSql, [userId, productId], function (err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, this.changes); // Return the number of rows affected by the deletion
                }
            });
        }
    });
};



module.exports.getCartItemCount = (userId, callback) => {
    const sql = `SELECT COUNT(*) AS count FROM carts WHERE userId = ?`;
    db.get(sql, [userId], (err, row) => {
        if (err) {
            callback(err);
            return;
        }
        const count = row ? row.count : 0;
        callback(null, count);
    });
};

module.exports.invalidateUserToken = (userId, callback) => {
    const sql = 'UPDATE users SET token = NULL WHERE id = ?';
    db.run(sql, [userId], (err) => {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}

module.exports.closeDatabase = () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
};
