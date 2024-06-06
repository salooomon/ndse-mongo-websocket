const express = require('express');
const mongoose = require('mongoose');

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const indexRouter = require('./routes/index');
const bookRouter = require('./routes/books');
const userRouter = require('./routes/user');

const books = require('./routes/api/books');
const user = require('./routes/api/user');
const error  = require('./middleware/error');
const logger = require('./middleware/logger');

const bookRender = require('./regulator/book/booksRender');
const userRender = require('./regulator/user/userRender');

const PORT = process.env.PORT || 3001;
const DB_URL = process.env.DB_URL || 'mongodb://root:example@mongo:27017';

const options = {
  usernameField: "username",
  passwordField: "password"
}

passport.use('local', new LocalStrategy(options, userRender.verifyUser));

passport.serializeUser(userRender.serializeUse);
passport.deserializeUser(userRender.serializeUse)


const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.urlencoded());
app.use(express.json());
app.use(session({secret: 'SECRET'}));

app.use(passport.initialize());
app.use(passport.session());

app.use(logger);
app.use('/', indexRouter);
app.use('/books', bookRouter);
app.use('/user', userRouter);
app.use('/api/books', books);
app.use('/api/user', user);
app.use(error);

async function start() {
  try {
    console.log(DB_URL);
    await mongoose.connect(DB_URL);
    bookRender.addBooks();

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });

  } catch (error) {
    console.log(error);
  }
}

start();