const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Connected Successfully...${PORT}`);
});


app.get('/', async (req, res) => {
    try {
        res.json('Welcome to E-Commerce Database!');
         console.log(`Backend connected!`);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});


app.get('/getData/:table', async (req, res) => {
    const { table } = req.params;
    try {
        const result = await pool.query(`SELECT * FROM ${table}`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/getCount/:table', async (req, res) => {
    const { table } = req.params;
    try {
        const result = await pool.query(`SELECT count(*) FROM ${table}`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/userID', async (req, res) => {
    const { table } = req.params;
    try {
        const result = await pool.query(`SELECT user_id FROM Users`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});


app.post('/addUser', async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash,role, created_at) VALUES ($1, $2, RANDOM(), $3, NOW()) RETURNING *`,
      [name, email, role]
    );
    res.status(201).json({ message: "User added"});
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post('/addCategory', async (req, res) => {
  const { name, description } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *`,
      [name, description]
    );
    res.status(201).json({ message: "Category added", category: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post('/addBrand', async (req, res) => {
  const { name, description } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO brands (brand_name, description) VALUES ($1, $2) RETURNING *`,
      [name, description]
    );
    res.status(201).json({ message: "Brand added", Brand: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/addProduct', async (req, res) => {
    const { name, description, price, stock_quantity, category_id, brand_id } = req.body;

  if (!name || !description || !price || !stock_quantity || !category_id || !brand_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, stock_quantity, category_id, brand_id) VALUES ($1, $2,$3,$4,$5,$6) RETURNING *`,
      [name, description, price, stock_quantity, category_id, brand_id]
    );
    res.status(201).json({ message: "Product added", Brand: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post('/addAddress', async (req, res) => {
  const {
    user_id,
    line1,
    city,
    state,
    postal_code,
    country,
    phone
  } = req.body;

  try {
    const result = await pool.query(`
      INSERT INTO Addresses (user_id, line1, city, state, postal_code, country, phone)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,[user_id, line1, city, state, postal_code, country, phone]);

    res.status(201).json({ message: 'Address added successfully' });
  } catch (err) {
    console.error('Error inserting address:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/addOrder', async (req, res) => {
  const { user_id, total_amount, shipping_address_id, payment_method } = req.body;

  try {
    const paymentResult = await pool.query(
      `INSERT INTO Payments (payment_method, amount_paid, payment_status, payment_date)
       VALUES ($1, $2, 'completed', CURRENT_TIMESTAMP)
       RETURNING payment_id`,
      [payment_method, total_amount]
    );

    const payment_id = paymentResult.rows[0].payment_id;

    await pool.query(
      `INSERT INTO Orders (user_id, order_date, status, total_amount, payment_id, shipping_address_id)
       VALUES ($1, CURRENT_TIMESTAMP, 'paid', $2, $3, $4)`,
      [user_id, total_amount, payment_id, shipping_address_id]
    );

    res.status(201).json({ message: ' Order and Payment saved successfully' });
  } catch (err) {
    console.error('Error inserting order & payment:', err);
    res.status(500).json({ error: 'Server error while saving order' });
  }
});


app.post('/addReview', async (req, res) => {
  const { user_id, product_id, rating, comment } = req.body;

  try {
    const insertQuery = `
      INSERT INTO Reviews (user_id, product_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await pool.query(insertQuery, [user_id, product_id, rating, comment]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting review:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/addCoupon', async (req, res) => {
  const { code, discount_percent, valid_from, valid_to } = req.body;

  try {
    const insertQuery = `
      INSERT INTO coupons (code, discount_percent, valid_from, valid_to)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await pool.query(insertQuery, [
      code,
      discount_percent,
      valid_from,
      valid_to
        ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting coupon:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/addOrderItem', async (req, res) => {
    const {  order_id, product_id, quantity, price_at_purchase } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO order_items ( order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2,$3,$4) RETURNING *`,
      [ order_id, product_id, quantity, price_at_purchase]
    );
    res.status(201).json({ message: "Order Item added", Brand: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





