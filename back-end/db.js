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

// Create users table
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