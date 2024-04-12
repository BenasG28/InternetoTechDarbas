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
  
  app.get('/products', (req, res) => {
    const { sort } = req.query;
    db.getAllProducts((err, products) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).send('Error retrieving products'); // Handle error
        }

        switch (sort) {
          case 'starsLowToHigh':
              products.sort((a, b) => a.stars - b.stars);
              break;
          case 'starsHighToLow':
              products.sort((a, b) => b.stars - a.stars);
              break;
          case 'priceLowToHigh':
              products.sort((a, b) => a.price - b.price);
              break;
          case 'priceHighToLow':
              products.sort((a, b) => b.price - a.price);
              break;
          case 'nameAToZ':
              products.sort((a, b) => a.name.localeCompare(b.name));
              break;
          case 'nameZToA':
              products.sort((a, b) => b.name.localeCompare(a.name));
              break;
          default:
              // If no valid sorting option is provided, return unsorted products
              break;
      }

        // Add more sorting criteria as needed

        res.json(products); // Send the array of sorted products as JSON response
    });
});

  app.get('/products/:id', (req, res) => { // Corrected the route to include :id as a parameter
    const productId = req.params.id; // Extract the productId from the request params
  
    db.getProductById(productId, (err, product) => { // Call getProductById with the extracted productId
      if (err) {
        console.error('Error fetching product:', err);
        return res.status(500).send('Error retrieving product'); // Handle error
      }
  
      if (!product) {
        return res.status(404).send('Product not found'); // Return 404 if product with the specified ID is not found
      }
  
      res.json(product); // Send the product as JSON response
    });
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
                    db.updateUserToken(user.id, token, (err) => {
                      if (err) {
                          console.error('Error updating user token:', err.message);
                          return res.status(500).json({ error: 'Internal server error' });
                      }

                      // Set the new token as a cookie
                      res.cookie("token", token, {
                          httpOnly: true,
                          sameSite: "None",
                          secure: true,
                      });

                      // Respond with a success message
                      res.status(200).json({ message: 'Login successful' });
                  });
                });
            });
        })
        .catch((error) => {
            // Validation error occurred
            res.status(400).json({ message: error.message });
        });
});

app.post("/logout", (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'None', secure: true });
  res.status(200).json({ message: 'Logout successful' });
});

app.get("/profile", (req, res) => {
  const token = req.cookies.token;

  // Call the findUserByToken function to retrieve user data
  db.findUserByToken(token, (err, user) => {
      if (err) {
          console.error('Error finding user by token:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }

      if (!user) {
          return res.status(401).json({ error: 'User not found' });
      }

      // If user data is found, return it as a JSON response
      res.status(200).json(user);
  });
});
app.post("/update-profile", authenticate, (req, res) => {
  const { username, cardNumber: newCardNumber } = req.body; // Ensure that 'newCardNumber' matches the key in the request body

  // Call the database function to update the user information
  db.updateUserInfo(username, newCardNumber, (err) => {
    if (err) {
      console.error('Error updating user info:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Send a success response back to the client
    res.status(200).json({ message: 'User information updated successfully' });
  });
});

// Middleware function to authenticate requests
function authenticate(req, res, next) {
  const token = req.cookies.token;

  // Check if token exists
  if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
  }

  // Verify token against the database
  db.findUserByToken(token, (err, user) => {
      if (err) {
          console.error('Error finding user by token:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }

      if (!user) {
          return res.status(401).json({ error: 'Unauthorized' });
      }

      // If user is authenticated, proceed to the next middleware or route handler
      req.userId = user.id; // Attach user ID to the request object for later use
      next();
  });
}

const addToCartSchema = yup.object().shape({
  productId: yup.number().required('Product ID is required').positive('Product ID must be a positive number'),
  quantity: yup.number().required('Quantity is required').positive('Quantity must be a positive number'),
});

// Protected endpoint to add a product to the user's cart
app.post("/cart/add", authenticate, (req, res) => {
  // Access userId from req object (set in the authenticate middleware)
  const userId = req.userId;

  addToCartSchema.validate(req.body)
    .then(validData => {
      const { productId, quantity } = validData;

      db.addToCart(userId, productId, quantity, (err)=>{
        if(err){
          console.error('Error adding to cart:', err.message);
          return res.status(500).json({ error: 'Internal server error.' });
        }
        res.status(200).json({ message: 'Product successfully added to cart.'});
      });
    })
    .catch(error => {
      console.error('Validation failed:', error.errors);
      res.status(400).json({ error: error.errors });
    });
});

// Protected endpoint to retrieve the list of products in the user's cart
app.get("/cart/items", authenticate, (req, res) => {
  // Access userId from req object (set in the authenticate middleware)
  const userId = req.userId;

  db.getCartItems(userId, (err, cartItems) => {
    if(err){
      console.error('Error getting cart:', err.message);
      return res.status(500).json({ error: 'Internal server error.' });
    }
    res.status(200).json({ cartItems });
  });
});

// Protected endpoint to remove a product from the user's cart
app.delete("/cart/remove/:productId", authenticate, (req, res) => {
  // Access userId from req object (set in the authenticate middleware)
  const userId = req.userId;
  const productId = req.params.productId;

  db.removeFromCart(userId, productId, (err) => {
    if (err) {
      console.error('Error removing product from cart:', err.message);
      return res.status(500).json({ error: 'Internal server error.' });
    }
    res.status(200).json({ message: 'Successfully removed product from cart.' });
  });
});

app.get('/cart/items/count', authenticate, (req, res) => {
  const userId = req.userId; // Assuming the user ID is obtained from authentication middleware

  // Call a function to query the database and get the count of cart items for the user
  db.getCartItemCount(userId, (err, count) => {
    if (err) {
      console.error('Error counting cart items:', err.message);
      return res.status(500).json({ error: 'Internal server error.' });
    }
    res.status(200).json({ count });
  });
});



// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
