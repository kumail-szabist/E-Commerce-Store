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


app.get('/cart', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cart');
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

  if (!name || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

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

  if (!name || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

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
