require('dotenv').config();
const express = require('express'),
  app = express(),
  createError = require('http-errors'),
  path = require('path'),
  logger = require('morgan'),
  bodyParser = require('body-parser', { useNewUrlParser: true }),
  expressSanitizer = require('express-sanitizer'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  passportLocal = require('passport-local'),
  User = require('./models/userModel'),
  Recipe = require('./models/recipeModel'),
  indexRouter = require('./routes/index'),
  usersRouter = require('./routes/user'),
  recipe = require('./routes/recipe'),
  ingredient = require('./routes/ingredient'),
  product = require('./routes/product'),
  session = require("express-session");
MongoStore = require('connect-mongo');
// Mongo Database
// mongoose.Promise = global.Promise;
// mongoose
//   .connect('mongodb+srv://' + process.env.DBURL + '', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log('DB config set up.');
//   })
//   .catch((err) => {
//     console.log('ERROR:', err.message);
//   });

// Local Mongo Database
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://mongo:27017/distSystemsFoodDB');
  console.log('Local Dist Systems Food Db config is set up');
}

var db = mongoose.connection;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));



app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

// required for passport session
app.use(session({
  secret: 'secrettexthere',
  saveUninitialized: true,
  resave: true,
  // using store session on MongoDB using express-session + connect
  store: MongoStore.create({ mongoUrl: 'mongodb://mongo:27017/distSystemsFoodDB' })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressSanitizer());

app.locals.moment = require('moment');

//local strategy
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/api', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/recipe', recipe);
app.use('/api/ingredient', ingredient);
app.use('/api/product', product);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
