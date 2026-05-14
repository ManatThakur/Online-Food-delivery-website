const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongodb');
const rootdir = require('../util/path');
const { connectDB, getDB } = require('../mongodb/connection');

const {check,validationResult} = require('express-validator');

const { insertUser } = require('../mongodb/user');

const FullNameValidator= check('name')
.notEmpty().withMessage('Full name is required')
.trim()
.isLength({ min: 3 }).withMessage('Full name must be at least 3 characters long')
.matches(/^[a-zA-Z\s]+$/).withMessage('Full name must contain only letters and spaces')
;
// Initialize database connection
let db;
connectDB().then(database => {
  db = database;
}).catch(err => {
  console.error('Failed to connect to database:', err);
});

exports.getHome = (req, res) => {
    res.sendFile(path.join(rootdir, 'view', 'index.html'));
}

exports.showCart = async (req, res) => {
  try {
    const cartCollection = db.collection('cart');

    // ✅ if POST → add item
    if (req.method === "POST") {
      const item = req.body;
      await cartCollection.insertOne(item);

      // Get all cart items and calculate total
      const cart = await cartCollection.find({}).toArray();
      const total = cart.reduce((sum, item) => sum + parseInt(item.price), 0);

      return res.render("cart", { cart: cart, total: total });
    }

    // ✅ if GET → only show
    else {
      const cart = await cartCollection.find({}).toArray();
      const total = cart.reduce((sum, item) => sum + parseInt(item.price), 0);

      res.render("cart", { cart: cart, total: total });
    }

  } catch (error) {
    console.error('Error handling cart:', error);
    res.status(500).send('Error processing cart request');
  }
};
exports.removeFromCart = async (req, res) => {
  try {
    const cartCollection = db.collection('cart');
    const itemId = req.params.id;

    await cartCollection.deleteOne({ _id: new ObjectId(itemId) });
    res.redirect('/cart');
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).send('Error processing cart request');
  }
};
exports.showDetails = (req, res) => {

    const foodName = decodeURIComponent(req.query.foodName || "");
    const price = decodeURIComponent(req.query.price || "");
    const image = decodeURIComponent(req.query.image || "");
    const description = decodeURIComponent(req.query.description || "");

    const item = {
        foodName,
        price,
        image,
        description
    };

    res.render("details", { item: item });
};
exports.orderNow = (req, res) => {
    const orderPath = path.join(rootdir, 'data', 'orders.json');
    const {foodName, price, image, description, qty}=req.body;
    fs.readFile(orderPath, "utf-8", (err, data) => {
        if (err) {
            console.error('Error reading orders data:', err);
            return res.status(500).send('Error reading orders data');
        }

        let orders = [];
        if (data.length > 0) {
            try {
                orders = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing orders data:', parseErr);
                orders = [];
            }
        }

        const item = {
            foodName,
            price,
            image,
            description,
            qty
        };

        orders.push(item);

        fs.writeFile(path.join(rootdir, 'data', 'orders.json'), JSON.stringify(orders),
            (err) => {
                if (err) {
                    console.error('Error writing orders data:', err);
                    return res.status(500).send('Error updating orders');
                }

                res.render("order", { item: item });
            }
        );
    });
};
exports.paymentPage = async (req, res) => {
  try {
    const cartCollection = db.collection('cart');
    const cart = await cartCollection.find({}).toArray();
    const total = cart.reduce((sum, item) => sum + parseInt(item.price), 0);
    const shipping = 100;
    const totalBill = total + shipping;

    res.render("payment", { total, shipping, totalBill });
  } catch (error) {
    console.error('Error loading payment page:', error);
    res.status(500).send('Error loading payment page');
  }
};

exports.processPayment = async (req, res) => {
  try {
    const cartCollection = db.collection('cart');
    await cartCollection.deleteMany({});

    res.render("paymentSuccess", { message: "Payment completed successfully" });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).send('Error processing payment');
  }
};

exports.showAuth = (req, res) => {
    res.render("auth");
}
exports.showSignup = (req, res) => {
    res.render("signup");
}
exports.postSignUp=[
  
  FullNameValidator,
   async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signup", { errors: errors.array(), oldInput: req.body });
    }
    const {name,email,password} = req.body;
    try {
      await insertUser({ name, email, password });
      res.sendFile(path.join(rootdir, 'view', 'index.html'));
    } catch (error) {
      console.error('Error saving user:', error);
      res.status(500).send('Registration failed');
    }
}
]