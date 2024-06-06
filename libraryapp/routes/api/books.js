const express = require('express');
const router = express.Router();

const fileMulter = require('../../middleware/file');

const {
    getBooks,
    getBook,
    editeBook,
    createBook,
    deleteBook
} = require('../../regulator/book/apiBooks');

router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/',fileMulter.single('fileBook') ,createBook);
router.put('/:id',fileMulter.single('fileBook') ,editeBook);
router.delete('/:id', deleteBook);

module.exports = router;
