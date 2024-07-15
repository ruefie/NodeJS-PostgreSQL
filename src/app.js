
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/orders', orderRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
