const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const passport = require('passport');

// Load User model
require('./models/User');
require('./models/Story');

// Pasport Config
require('./config/passport')(passport)

// Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');

// Load Keys
const keys = require('./config/keys');

// Handlebars Helpers
const {
  truncate,
  stripTags,
  formatDate,
  select
} = require('./helpers/hbs');

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
  helpers: {
    truncate: truncate,
    stripTags: stripTags,
    formatDate: formatDate,
    select: select
  },
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Express Session Middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


// Use Routes
app.use('/auth', auth);
app.use('/', index);
app.use('/stories', stories)

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});