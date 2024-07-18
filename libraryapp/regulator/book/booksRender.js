const saveBook = require('../../other/saveBooks');
const Book = require('../../models/book');
const Message = require('../../models/message');
const User = require('../../models/user');

const PORT = process.env.CNT_PORT || 3000;
const BASE_URL = process.env.BASE_URL || "http://counter";

// Страница просмотр всех книг в библиотеке
module.exports.renderLibrary = (req, res) => {
    Book.find()
        .then((books) => res.status(200).render('books/index', {
            title: 'Библиотека',
            books,
        }))
        .catch((e) => {
            console.log(e);
        });
};

// Страница добавления книги
module.exports.renderPageCreateBook = (req, res) => {
    res.render('books/create', {
        title: 'Добавление книги',
        book: {},
    });
};

// Создание книги
module.exports.createPage = (req, res) => {
    const {
        title, description, authors, favorite,
        fileCover, fileName,
    } = req.body;
    const fileBook = req.file ? req.file.path : '';
    Book.create({
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
        fileBook,
    }).then(() => res.redirect('/books'))
        .catch((e) => {
            console.log(e);
        });
};

// Страница просмотра книги
module.exports.renderPageBook = async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Book.findById(id).orFail();
        let cnt = 0;
        try {
            const response = await fetch(`${BASE_URL}:${PORT}/counter/${id}/incr`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            cnt = data.cnt;
        } catch (error) {
            console.log(error);
        }
        user = req.isAuthenticated() ? req.user : null;

        const messages = await Message.find( {bookid: id} ).sort({ createdAt: -1 })
        for (const message of messages) {
            const user = await User.findOne({ username: message.username });
            if (user) {
                message.username = user.displayName;
            }
        }

        res.render('books/view', {
            title: `Книга | ${book.title}`,
            book,
            user,
            messages,
            count: cnt,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/404');
    }
};

//Редактирование книги
module.exports.renderEdite = (req, res) => {
    const { id } = req.params;
    Book.findById(id).orFail()
        .then((book) => res.render('books/update', {
            title: `Книга | ${book.title}`,
            book,
        }))
        .catch((e) => {
            console.log(e);
            res.redirect('/404');
        });
};

// Страница  редактирование книги
module.exports.renderPageEditeBook = (req, res) => {
    const { id } = req.params;
    const {
        title, description, authors, favorite,
        fileCover, fileName,
    } = req.body;
    const isFavorite = favorite === 'on' || Boolean(favorite);
    const fileBook = req.file ? req.file.path : null;
    Book.findByIdAndUpdate(id, {
        title,
        description,
        authors,
        favorite: isFavorite,
        fileCover,
        fileName,
        fileBook,
    }).orFail()
        .then(() => res.redirect(`/books/${id}`))
        .catch((e) => {
            console.log(e);
            res.redirect('/404');
        });
};

// Страница удаление книги
module.exports.deleteBook = async (req, res) => {
    const { id } = req.params;
    try {
        await Book.findByIdAndDelete(id).orFail();
        res.redirect('/books');
    } catch (error) {
        console.log(error);
        res.redirect('/404');
    }
};

// Добавление книг в локальное хранилище saveBooks
module.exports.addBooks = async () => {
    try {
        const promises = saveBook.map(async (book) => {
            const existingBook = await Book.findOne({ title: book.title });
            if (!existingBook) {
                await Book.create(book);
                console.log(`Книга "${book.title}" успешно добавлена в базу данных`);
            } else {
                console.log(`Книга "${book.title}" уже существует в базе данных`);
            }
        });

        await Promise.all(promises);
    } catch (error) {
        console.error('Ошибка при добавлении книг:', error);
    }
};