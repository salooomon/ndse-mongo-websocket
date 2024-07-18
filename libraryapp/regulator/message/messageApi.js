const Message = require('../../models/message');

// Получение сообщение
module.exports.getMessage = (req, res) => {
    const { id } = req.params;
    Message.find( {bookid: id} )
        .then((messages) => res.status(200).json(messages))
        .catch((e) => {
            console.log(e);
        });
};

// Отправка сообщений
module.exports.sendMessage = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).json('Нет доступа');
    }
    const {
        bookid, username, message
    } = req.body;
    Message.create({
        bookid, username, message
    }).then((newMessage) => res.status(201).json(newMessage))
        .catch((e) => {
            console.log(e);
        });
};