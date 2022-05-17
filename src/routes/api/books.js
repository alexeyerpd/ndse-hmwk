const express = require('express');

const { fileMiddleware } = require('../../middleware');
const { Book } = require('../../models');
const { sendJsonByStatus, getUpdatedNewBook } = require('../../utils');

const router = express.Router();

const store = {
    books: [
        // new Book(
        //     'Первая книга',
        //     'Описание для первой книги',
        //     'Автор 1',
        //     false,
        //     'file name',
        //     'public\\files\\1651952498084-book.pdf',
        //     'public\\img\\1651429602024-fon.jpg',
        //     '3336a1e6-9c91-48e0-b374-608bba451696',
        // ),
    ],
};

router.get('/', (req, res) => {
    sendJsonByStatus(res, store.books);
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const book = store.books.find((item) => item.id === id);

    if (!book) {
        sendJsonByStatus(res, null, 404);
        return;
    }

    sendJsonByStatus(res, book);
});

router.get('/:id/download', (req, res) => {
    const { id } = req.params;

    const book = store.books.find((book) => book.id === id);
    if (!book) {
        return sendJsonByStatus(res, null, 404);
    }

    res.download(`${__dirname}/../${book.fileBook}`, (err) => {
        if (err) {
            sendJsonByStatus(res, null, 404);
        }
    });
});

router.post(
    '/',
    fileMiddleware.fields([{ name: 'fileBook' }, { name: 'fileCover' }]),
    (req, res) => {
        const { authors, title, description, fileName, favorite } = req.body;
        const { fileBook: fileBooks, fileCover: fileCovers } = req.files;

        const fileBookPath = fileBooks?.[0]?.path;
        const fileCoverPath = fileCovers?.[0]?.path;

        const book = new Book(
            title,
            description,
            authors,
            favorite,
            fileName,
            fileBookPath,
            fileCoverPath,
        );

        store.books.push(book);
        sendJsonByStatus(res, book, 201);
    },
);

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const index = store.books.findIndex((item) => item.id === id);

    if (index === -1) {
        sendJsonByStatus(res, null, 404);
        return;
    }

    store.books[index] = getUpdatedNewBook(store.books[index], req.body);

    sendJsonByStatus(res, store.books[index]);
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const index = store.books.findIndex((item) => item.id === id);

    if (index === -1) {
        sendJsonByStatus(res, null, 404);
        return;
    }

    store.books.splice(index, 1);

    sendJsonByStatus(res, 'ok');
});

module.exports = router;
