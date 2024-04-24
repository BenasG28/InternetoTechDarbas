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
      
  });
  
  app.get('/products', (req, res) => {
    const { sort } = req.query;
    db.getAllProducts((err, products) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).send('Error retrieving products'); 
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
              
              break;
      }

        

        res.json(products); 
    });
});

  app.get('/products/:id', (req, res) => { 
    const productId = req.params.id; 
  
    db.getProductById(productId, (err, product) => { 
      if (err) {
        console.error('Error fetching product:', err);
        return res.status(500).send('Error retrieving product'); 
      }
  
      if (!product) {
        return res.status(404).send('Product not found'); 
      }
  
      res.json(product); 
    });
  });

  app.post("/register", (req, res) => {
    const { username, password, cardNumber } = req.body;
  
    registrationValidationSchema
      .validate(req.body)
      .then(() => {
        db.findUserByUsername(username, (error, existingUser) => {
          if (error) {
            console.error('Error finding user:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
          }
  
          if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
          }
          const tokenExpiration = new Date();
          tokenExpiration.setHours(tokenExpiration.getHours() + 1);
  
          const token = uuidv4();
  
          db.createUserWithToken(username, password, cardNumber, token, tokenExpiration, (err, result) => {
            if (err) {
              console.error('Error creating user:', err.message);
              return res.status(500).json({ error: 'Internal server error' });
            }
  
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
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    loginValidationSchema.validate({ username, password })
        .then(() => {
            db.findUserByUsername(username, (error, user) => {
                if (error) {
                    console.error('Error finding user:', error.message);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                if (!user) {
                    return res.status(401).json({ message: "Invalid username or password" });
                }

                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        console.error('Error comparing passwords:', err.message);
                        return res.status(500).json({ error: 'Internal server error' });
                    }

                    if (!result) {
                        return res.status(401).json({ message: "Invalid username or password" });
                    }
                    const tokenExpiration = new Date();
                    tokenExpiration.setHours(tokenExpiration.getHours() + 1);

                    const token = uuidv4();
                    db.updateUserToken(user.id, token, tokenExpiration, (err) => {
                      if (err) {
                          console.error('Error updating user token:', err.message);
                          return res.status(500).json({ error: 'Internal server error' });
                      }

                      res.cookie("token", token, {
                          httpOnly: true,
                          sameSite: "None",
                          secure: true,
                      });

                      res.status(200).json({ message: 'Login successful' });
                  });
                });
            });
        })
        .catch((error) => {
            res.status(400).json({ message: error.message });
        });
});

app.post("/logout", authenticate, (req, res) => {
  const userId = req.userId;
  db.invalidateUserToken(userId, (err) => {
    if (err) {
      console.error('Error invalidating user token:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.clearCookie('token', { httpOnly: true, sameSite: 'None', secure: true });
    res.status(200).json({ message: 'Logout successful' });
  });
});

app.get("/profile", authenticate, (req, res) => {
  const token = req.cookies.token;

  db.findUserByToken(token, (err, user) => {
      if (err) {
          console.error('Error finding user by token:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }

      if (!user) {
          return res.status(401).json({ error: 'User not found' });
      }

      res.status(200).json(user);
  });
});
app.post("/update-profile", authenticate, (req, res) => {
  const { username, cardNumber: newCardNumber } = req.body;

  db.updateUserInfo(username, newCardNumber, (err) => {
    if (err) {
      console.error('Error updating user info:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(200).json({ message: 'User information updated successfully' });
  });
});

function authenticate(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
  }

  db.findUserByToken(token, (err, user) => {
      if (err) {
          console.error('Error finding user by token:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }

      if (!user) {
          return res.status(401).json({ error: 'Unauthorized' });
      }

      if (user.tokenExpiration && new Date(user.tokenExpiration) < new Date()) {
        return res.status(401).json({ error: 'Token expired' });
      }
      req.userId = user.id;
      next();
  });
}

const addToCartSchema = yup.object().shape({
  productId: yup.number().required('Product ID is required').positive('Product ID must be a positive number'),
  quantity: yup.number().required('Quantity is required').positive('Quantity must be a positive number'),
});

app.post("/cart/add", authenticate, (req, res) => {
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

app.get("/cart/items", authenticate, (req, res) => {
  const userId = req.userId;

  db.getCartItems(userId, (err, cartItems) => {
    if(err){
      console.error('Error getting cart:', err.message);
      return res.status(500).json({ error: 'Internal server error.' });
    }
    res.status(200).json({ cartItems });
  });
});

app.delete("/cart/remove/:productId", authenticate, (req, res) => {
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
  const userId = req.userId; 

  db.getCartItemCount(userId, (err, count) => {
    if (err) {
      console.error('Error counting cart items:', err.message);
      return res.status(500).json({ error: 'Internal server error.' });
    }
    res.status(200).json({ count });
  });
});

app.get("/validate-token", authenticate, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
