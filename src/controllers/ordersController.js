const pool = require('../db/pool');

const getOrders = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOrderById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createOrder = async (req, res) => {
  const { price, date, user_id } = req.body;
  try {
    const result = await pool.query('INSERT INTO orders (price, date, user_id) VALUES ($1, $2, $3) RETURNING *', [price, date, user_id]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOrder = async (req, res) => {
  const id = parseInt(req.params.id);
  const { price, date, user_id } = req.body;
  try {
    const result = await pool.query('UPDATE orders SET price = $1, date = $2, user_id = $3 WHERE id = $4 RETURNING *', [price, date, user_id, id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the order exists
    const orderCheck = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderCheck.rows[0];

    // Check if the associated user exists
    const userCheck = await pool.query('SELECT * FROM users WHERE id = $1', [order.user_id]);
    if (userCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Associated user does not exist' });
    }

    // Delete the order
    const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
