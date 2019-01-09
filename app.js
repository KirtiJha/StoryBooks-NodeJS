const express = require('express');
const exphbs  = require('express-handlebars');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const passport = require('passport');

// Load User model
require('./models/User');

// Pasport Config
require('./config/passport')(passport)

// Load Routes
const auth = require('./routes/auth');

// Load Keys
const keys = require('./config/keys');

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Mongoose connect
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true
})
.then(() => console.log('MongoDB Connected....'))
.catch(err => console.log(err));

const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Express Session Middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Passport Middleware (Should be after Express session middleware)
app.use(passport.initialize());
app.use(passport.session());

// Cookie-Parser Middleware
app.use(cookieParser());

// Global Variables
app.use(function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.get('/', (req, res) => {
  res.render('index');
});

// Use Routes
app.use('/auth', auth);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});