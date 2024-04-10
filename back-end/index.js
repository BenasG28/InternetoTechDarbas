const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sqlite3 = require('sqlite3').verbose();
const db = require('./db');
const yup = require('yup');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require("uuid");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cookieParser());

const registrationValidationSchema = yup.object().shape({
    username: yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters long')
      .max(20, 'Username must not exceed 20 characters')
      .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    password: yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]*$/,
        'Password must contain at least one upper case letter, one lower case letter, and one digit'
      ),
    cardNumber: yup.string()
      .required('Card number is required')
      .matches(/^\d{13,19}$/, 'Invalid card number')
      // You may add more specific rules for card numbers based on your requirements
  });
  

  app.post("/register", (req, res) => {
    const { username, password, cardNumber } = req.body;
  
    registrationValidationSchema
      .validate(req.body)
      .then(() => {
        // Check if user already exists
        db.findUserByUsername(username, (error, existingUser) => {
          if (error) {
            console.error('Error finding user:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
          }
  
          if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
          }
  
          // Generate a token
          const token = uuidv4();
  
          // Save user data and token to the database
          db.createUserWithToken(username, password, cardNumber, token, (err, result) => {
            if (err) {
              console.error('Error creating user:', err.message);
              return res.status(500).json({ error: 'Internal server error' });
            }
  
            // Set token as a cookie
            res
              .status(201)
              .cookie("token", token, {
                httpOnly: true,
                sameSite: "None",
                secure: true,
              })
              .json({ message: 'User registered successfully' });
          });
        });
      })
      .catch((error) => {
        console.error('Validation error:', error.message);
        res.status(400).json({ message: error.message });
      });
  });
  const loginValidationSchema = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required')
});
// Handle login request
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Validate login credentials against the schema
    loginValidationSchema.validate({ username, password })
        .then(() => {
            // Proceed with authentication
            // Check if the username exists
            db.findUserByUsername(username, (error, user) => {
                if (error) {
                    console.error('Error finding user:', error.message);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                if (!user) {
                    return res.status(401).json({ message: "Invalid username or password" });
                }

                // Compare the provided password with the hashed password in the database
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        console.error('Error comparing passwords:', err.message);
                        return res.status(500).json({ error: 'Internal server error' });
                    }

                    if (!result) {
                        return res.status(401).json({ message: "Invalid username or password" });
                    }

                    // If the password is correct, set a token as a cookie
                    const token = uuidv4();
                    res
                        .status(200)
                        .cookie("token", token, {
                            httpOnly: true,
                            sameSite: "None",
                            secure: true,
                        })
                        .json({ message: 'Login successful' });
                });
            });
        })
        .catch((error) => {
            // Validation error occurred
            res.status(400).json({ message: error.message });
        });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
