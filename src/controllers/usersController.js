const pool = require("../db/pool");

const getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createUser = async (req, res) => {
  const { first_name, last_name, age } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (first_name, last_name, age) VALUES ($1, $2, $3) RETURNING *",
      [first_name, last_name, age]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  const { first_name, last_name, age } = req.body;
  const updates = [];
  const values = [];

  if (first_name) {
    values.push(first_name);
    updates.push(`first_name = $${values.length}`);
  }

  if (last_name) {
    values.push(last_name);
    updates.push(`last_name = $${values.length}`);
  }

  if (age) {
    values.push(age);
    updates.push(`age = $${values.length}`);
  }

  values.push(req.params.id);

  const query = `UPDATE users SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING *`;

  try {
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const orderCheck = await pool.query(
      "SELECT 1 FROM orders WHERE user_id = $1 LIMIT 1",
      [id]
    );
    if (orderCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Cannot delete user with associated orders" });
    }

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserOrders = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query("SELECT * FROM orders WHERE user_id = $1", [
      id,
    ]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const checkInactiveUser = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query("SELECT * FROM orders WHERE user_id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      await pool.query("UPDATE users SET active = false WHERE id = $1", [id]);
    }
    res.status(200).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserOrders,
  checkInactiveUser,
};
