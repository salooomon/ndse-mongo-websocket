const User = require('../../models/user');

const serializeUse = (user, cb) => {
    cb(null, user);
};

const deserializeUser = (user, cb) => {
    User.findById(user.id, (error, userData) => {
        if(error) {
            return cb(error);
        }
        return cb(null, userData);
    });
};

const verifyUser = async (username, password, done) => {
    await User.findOne({ username })
        .then((user) => {
            if (!user) {
                return done(null, user);
            }
            if (user.password === password) {
                return done(null, user);
            }
            return done(null, false);
        })
        .catch((error) => done(error))
};

// Рендер страницы пользователя
const userLogin = (req, res) => {
    console.log('req.user: ', req.user);
    res.redirect('/');
};

// Выход из аккаунта
const userLogout = (req, res) => {
    req.logout((error) => {
        if (error) {
            console.log(error);
            return res.redirect('/404');
        }
        return res.redirect('/');
    });
};

// Рендер профиля
const renderProfile = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('user/login');
    }
    return res.render('user/profile', {title: 'Profile', user: req.user });
};

// Рендер авторизации
const renderLogin = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return res.render('user/login', { title: 'Sign in' });
};

// Рендер регистрация
const renderRegister = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return res.render('user/register', {title: 'Register'});
};

// Рендер регистрация
const userRegister = async (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    const { displayName, username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            await User.create({ displayName, username, password });
            console.log(`User ${username} added successfully!`);
            return  res.redirect('user/login');
        }
        console.log(`User ${username} already exists!`);
        return res.render('user/register', {title: 'Register'});
    } catch (error) {
        return res.render('user/register', {title: 'Register'});
    }
};

module.exports = {
    verifyUser,
    serializeUse,
    deserializeUser,
    userLogin,
    renderLogin,
    userLogout,
    renderProfile,
    renderRegister,
    userRegister,
};