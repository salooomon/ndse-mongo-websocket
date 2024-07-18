const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const indexRouter = require('./routes/index');
const bookRouter = require('./routes/books');
const userRouter = require('./routes/user');

const books = require('./routes/api/books');
const user = require('./routes/api/user');
const error  = require('./middleware/error');
const message = require('./routes/api/message');
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

passport.serializeUser(userRender.serializeUser);
passport.deserializeUser(userRender.serializeUser)


const app = express();
const server = http.Server(app);
const io = socketIo(server);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'SECRET',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(logger);
app.use('/', indexRouter);
app.use('/books', bookRouter);
app.use('/user', userRouter);
app.use('/public', express.static(`${__dirname}/public`));
app.use('/api/books', books);
app.use('/api/user', user);
app.use('/api/message', message);
app.use(error);

async function start() {
  try {
    console.log(DB_URL);
    await mongoose.connect(DB_URL);
    bookRender.addBooks();

    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });

  } catch (error) {
    console.log(error);
  }
}

start();

io.on('connection', (socket) => {
  const { id } = socket;
  console.log(`Socket connected: ${id}`);

  const { bookId } = socket.handshake.query;
  console.log(`Socket roomName: ${bookId}`);
  socket.join(bookId);
  socket.on('message-to-book', (msg) => {
    socket.to(bookId).emit('message-to-book', msg);
    socket.emit('message-to-book', msg);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${id}`);
  });
});