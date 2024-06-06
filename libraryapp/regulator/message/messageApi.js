const Message = require('../../models/message');

// Получение сообщение
const getMessage = (req, res) => {
    const { id } = req.params;
    Message.find({ bookid: id })
    .then((mess) => res.status(200).json(mess))
    .catch((error) => {
        console.log(error);
    });
};

// Отправка сообщений
const sendMessage = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).json('No access')
    }
    const {bookid, username, message} = req.body;
    Message.create({bookid, username, message})
    .then((newMessage) => res.status(201).json(newMessage))
    .catch((error) => {
        console.log(error);
    });
};

module.exports = { getMessage, sendMessage }