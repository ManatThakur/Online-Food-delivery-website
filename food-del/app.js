const http = require('http');
const fs = require('fs');
const path = require('path');
const dotenvResult = require('dotenv').config({ path: path.join(__dirname, '.env') });
if (dotenvResult.error) {
  console.warn('dotenv did not load .env file:', dotenvResult.error);
} else {
  console.log('dotenv loaded .env successfully');
}

const express = require('express');
const homeRouter = require('./router/homeRouter');
const PORT = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'view');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle JSON parse errors from express.json()
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Invalid JSON received:', err.message);
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  next(err);
});

app.use(express.static(path.join(__dirname, 'styles')));

app.use(homeRouter);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
