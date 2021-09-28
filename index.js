const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const connectDB = require('./db');

const usersRoutes = require('./routes/users');
const walletRoutes = require('./routes/wallets');
const operationRoutes = require('./routes/operations');

const app = express();
connectDB();

let corsOptions = {
  origin: ['http://localhost:3000'],
};

app.use(express.static(path.join(__dirname, 'client', 'build')));
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/users', usersRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/operations', operationRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message || 'Internal server error';
  return res.status(status).json({ message: message });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
