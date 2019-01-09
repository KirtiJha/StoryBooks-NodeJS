const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');

// Pasport Config
require('./config/passport')(passport)

// Load Routes
const auth = require('./routes/auth');

const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.render('index');
});

// Use Routes
app.use('/auth', auth);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});