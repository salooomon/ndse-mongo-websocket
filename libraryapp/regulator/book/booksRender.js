const saveBook = require('../../other/saveBooks');
const Book = require('../../models/book');

const PORT = process.env.CNT_PORT || 3000;
const BASE_URL = process.env.BASE_URL || "http://counter";

// Страница просмотр всех книг в библиотеке
const renderLibrary = (req, res) => {
    Book.find()
        .then((books) => res.status(200.).render("books/index", {
        title: "Library",
        books
    }))
        .catch((error) => {
            console.log(error)
        })
}

// Страница создания книги
const RenderPageCreateBook = (req, res) => {
    res.render("books/create", {
        title: "Add book",
        books: {}
    })
}

// Создание книги
const createPage = (req, res) => {
    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
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
    }.then(() => res.redirect('/book'))
    .catch((error) => console.log(error))
)};

// Страница просмотра книги
const renderPageBook = async  (req, res) => {
    const { id } = req.params
    try {
        const book = await Book.findById(id).orFail();
        let cnt = 0;
        try {
            const response = await fetch(`${BASE_URL}:${PORT}/counter/${id}/incr`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const data = await response.json();
            cnt = data.cnt;
        } catch (error) {
            console.log(error)
        }

        res.render("books/view", {
            title: "Book",
            books: book,
            count: cnt
        });

    } catch (error) {
        console.log(error);
        res.redirect('/404');
    }
};

//Редактирование книги
const renderEdite =  (req, res) => {
    const { id } = req.params;
    Book.findById(id).orFail()
        .then((book) => res.render('books/update', {
            title: `Book | ${book.title}`,
            book: book,
        }))
        .catch((e) => {
            console.log(e);
            res.redirect('/404');
        });
};

// Страница  редактирование книги
const renderPageEditeBook = (req, res) => {
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

    Book.findByIdAndUpdate(id, {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName
    }).orFail()
    .then(() => res.redirect(`/books/${id}`))
    .catch((error) => {
        console.log(error);
        res.redirect('/404');
    });
};

// Страница удаление книги

const deleteBook = async (req, res) => {
    const { id } = req.params;
    try {
        await Book.findByIdAndDelete(id).orFail();
        res.redirect('/books');
    } catch (error) {
        console.log(error);
        res.redirect('/404');
    }
}

// Страница Добавление книг в локальное хранилище saveBooks

const addBooks = async () => {
    try {
        for (const book of saveBook) {
            const isBook = await Book.findOne({title: book.title});
            if(!isBook) {
                await Book.create(book);
                console.log(`book ${book.title} add to DB!`);
            }else {
                console.log(`book ${book.title} has already on DB!`);
            }
        }
    } catch (error) {
        console.log(`error`, error);
    }
}

module.exports = {renderLibrary, RenderPageCreateBook, createPage, renderPageBook, renderPageEditeBook, deleteBook, addBooks, renderEdite}