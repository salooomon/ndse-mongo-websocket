const Book = require('../../models/book');

// Получение всех книг
const getBooks = (req, res) => {
    Book.find()
        .then((books) => res.status(200).json(books))
        .catch((error) => {
            console.log(error)
        })
}

// Получение книги по id
const getBook = async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Book.findById(id).orFail();
        res.json(book);
    } catch (error) {
        if(error.name === 'DocumentNotFoundError') {
            res.status(404).json('404 | Not found book');
        } else {
            res.status(500).json(error.message);
        }
    }
}
// Создание книги с последующим возвращением книги
const createBook = (req, res) => {
    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName
    } = req.body;

    if(req.file) {
        const { path } = req.file
        const fileBook = path
    };

    Book.create({
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName
    }).then((book) => res.status().json(book))
        .catch((error) => {
            console.log(error);
        })
}

// Редактирование книги по id
const editeBook = async (req, res) => {
    const { id } = req.params;
    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName
    } = req.body;
    if(req.file) {
        const { path } = req.file
        const fileBook = path
    };

    try {
        const book = Book.findByIdAndupdate(id, {
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName
        });
        res.json(book)
    } catch (error) {
        if(error.name === 'DocumentNotFoundError') {
            res.status(404).json('404 | Not found book');
        } else {
            res.status(500).json(error.message);
        }
    }
}

// Удаление книги по id
const deleteBook = async (req, res) => {
    const { id } = req.params;
    try {
        await Book.findByIdAndDelete(id).orFail();
        res.json('ok');
    } catch (error) {
        if(error.name === 'DocumentNotFoundError') {
            res.status(404).json('404 | Not found book');
        } else {
            res.status(500).json(error.message);
        }
    }
}

module.exports = { getBooks, getBook, editeBook, createBook, deleteBook}