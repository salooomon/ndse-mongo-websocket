const User = require('../../models/user');

// Авторизация пользователя
module.exports.userLogin = (req, res) => {
    res.json(req.user);
};


// Регистрация пользователя
module.exports.userRegister = async (req, res) => {
    const {
        displayName, username, password,
    } = req.body;
    if (!username || !password) {
        return res.status(400).json('Отсутствуют обязательные поля');
    }
    try {
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            const newUser = await User.create({
                displayName, username, password,
            });
            return res.status(201).json(newUser);
        }
        return res.status(409).json(`Пользователь "${username}" уже существует в базе данных`);
    } catch (error) {
        console.log(error);
        return res.status(500).json('Ошибка при добавлении пользователя');
    }
};

// Профиль пользователя
module.exports.userProfile = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).json('Нет доступа');
    }
    return res.status(200).json(req.user);
};
