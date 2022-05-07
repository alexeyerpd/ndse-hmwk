const express = require('express');
const fs = require('fs');
const path = require('path');

const fileMiddleware = require('../../middleware/file');
const { Book } = require('../../models');
const { compareCurrentBookWithBody } = require('../../utils');
const router = express.Router();

const store = {
    books: [
        new Book(
            'Первая книга',
            'Описание для первой книги',
            'Автор 1',
            true,
            'file name',
            'public\\files\\1651952498084-book.pdf',
            'public\\img\\1651429602024-fon.jpg',
            '3336a1e6-9c91-48e0-b374-608bba451696',
        ),
        new Book(
            'Вторая книга',
            'Описание для второй книги',
            'Автор 2',
            false,
            'file name',
            'public\\files\\1651952498084-book.pdf',
            'public\\img\\1651429602024-fon.jpg',
            '3336a1e6-9c91-48e0-b374-608bba451697',
        ),
        new Book(
            'Третья книга',
            'Описание для третьей книги',
            'Автор 3',
            false,
            'file name',
            'public\\files\\1651952498084-book.pdf',
            'public\\img\\1651429602024-fon.jpg',
            '3336a1e6-9c91-48e0-b374-608bba451698',
        ),
    ],
};

router.get('/update/:id', (req, res) => {
    const { id } = req.params;
    const book = store.books.find((book) => book.id === id);

    if (book) {
        res.render('books/update', {
            title: 'Редактирование книги',
            book,
        });
    } else {
        res.render('error/404', { title: 'Книга не найдена' });
    }
});

router.post(
    '/update/:id',
    fileMiddleware.fields([{ name: 'fileBook' }, { name: 'fileCover' }]),
    (req, res) => {
        const { id } = req.params;
        const body = req.body;

        const book = store.books.find((book) => book.id === id);

        const fieldsForUpdate = compareCurrentBookWithBody(book, body);
        if (fieldsForUpdate.length) {
            for (let [k, v] of fieldsForUpdate) {
                if (k === 'favorite') {
                    book[k] = !v;
                } else {
                    book[k] = v;
                }
            }
        }
        const needFilesUpdate = Object.entries(req?.files || {});
        if (needFilesUpdate.length) {
            for (let [k, v] of needFilesUpdate) {
                const newPathToFile = v[0].path;
                const prevToFile = book[k];
                book[k] = newPathToFile;
                try {
                    fs.unlinkSync(path.resolve(prevToFile));
                } catch (err) {
                    console.error(err);
                }
            }
        }

        res.redirect(`/books/${id}`);
    },
);

router.get('/create', (req, res) => {
    res.render('books/create', { title: 'Создание книги' });
});

router.post(
    '/create',
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

        res.redirect(`/books/${book.id}`);
    },
);

router.post('/delete/:id', (req, res) => {
    const { id } = req.params;

    const index = store.books.findIndex((book) => book.id === id);
    if (index !== -1) {
        const book = store.books.splice(index, 1)[0];
        const { fileBook, fileCover } = book;

        try {
            fs.unlinkSync(path.join(req.rootDir, fileBook));
            fs.unlinkSync(path.join(req.rootDir, fileCover));
        } catch (err) {
            console.err(err);
        }
    }

    res.redirect('/books');
});

router.get('/', (req, res) => {
    res.render('books/index', { title: 'Список книг', books: store.books });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const book = store.books.find((book) => book.id === id);

    if (book) {
        res.render('books/view', { title: 'Книга', book });
    } else {
        res.render('error/404', { title: 'Книга не найдена' });
    }
});

module.exports = router;
