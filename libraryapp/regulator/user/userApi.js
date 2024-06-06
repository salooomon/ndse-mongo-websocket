const User = require('../../models/user');

// Авторизация пользователя
const userLogin = (req, res) => {
    res.json(req.user);
};

// Регистрация пользователя
const userRegister = async (req, res) => {
    const { displayName, username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json('Required fields are missing');
    }
    try {
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            const newUser = await User.create({
                displayName, username, password
            });
            return  res.status(201).json(newUser);
        }
        return res.status(409).json(`${username} user already exists`);
    }catch (error) {
        console.log(error);
        return res.status(500).json('Error added user');
    }
};

// Профиль пользователя
const userProfile = (req, res) => {
    if(!req.isAuthenticated()) {
        return res.status(403).json('No access');
    }
    return res.status(200).json(req.user);
};

module.exports = { userLogin, userRegister, userProfile };