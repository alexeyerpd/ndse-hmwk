const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const fileMiddleware = require('../../middleware/file');
const { Book } = require('../../models');
const { mapWebToDBBook, userMapper } = require('../../mappers');

const router = express.Router();

const COUNTER_URL = process.env.COUNTER_URL || 'http://localhost:3002';

router.get('/update/:id', async (req, res) => {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (book) {
        res.render('books/update', {
            title: 'Редактирование книги',
            book,
            isAuth: req.isAuthenticated(),
        });
    } else {
        res.render('error/404', {
            title: 'Книга не найдена',
            isAuth: req.isAuthenticated(),
        });
    }
});

router.post(
    '/update/:id',
    fileMiddleware.fields([{ name: 'fileBook' }, { name: 'fileCover' }]),
    async (req, res) => {
        const { id } = req.params;
        const body = req.body;

        try {
            const book = await Book.findById(id);
            const updatedBook = mapWebToDBBook(body);

            const needFilesUpdate = Object.entries(req?.files || {});
            if (needFilesUpdate.length) {
                for (let [k, v] of needFilesUpdate) {
                    const newPathToFile = v[0].path;
                    const prevToFile = book[k];
                    updatedBook[k] = newPathToFile;
                    try {
                        if (prevToFile) {
                            fs.unlinkSync(path.resolve(prevToFile));
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }
            }

            await Book.updateOne({ _id: id }, updatedBook);
            res.redirect(`/books/${id}`);
        } catch (e) {
            res.redirect(`/books`);
        }
    },
);

router.get('/create', (req, res) => {
    res.render('books/create', {
        title: 'Создание книги',
        isAuth: req.isAuthenticated(),
    });
});

router.post(
    '/create',
    fileMiddleware.fields([{ name: 'fileBook' }, { name: 'fileCover' }]),
    async (req, res) => {
        const { authors, title, description, fileName, favorite } = req.body;
        const { fileBook: fileBooks, fileCover: fileCovers } = req.files;

        const fileBookPath = fileBooks?.[0]?.path;
        const fileCoverPath = fileCovers?.[0]?.path;

        const newBook = new Book({
            title,
            description,
            authors,
            favorite,
            fileName,
            fileBookPath,
            fileCoverPath,
        });

        try {
            await newBook.save();
        } catch (e) {
            console.log(e);
        }

        res.redirect(`/books/${newBook._id}`);
    },
);

function deleteImgIfNotEmptyPath(req, filePath) {
    if (!filePath) return;

    try {
        fs.unlinkSync(path.join(req.rootPublicDir, filePath));
        return true;
    } catch (e) {
        throw new Error('failed to delete');
    }
}

router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Book.findById(id);

        if (book) {
            const boundFn = deleteImgIfNotEmptyPath.bind(null, req);
            [book.fileCover, book.fileBook].forEach(boundFn);
            await Book.deleteOne({ _id: id });
        }
        res.redirect('/books');
    } catch (e) {
        res.redirect(`/books/${id}`);
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Book.findById(id).populate({
            path: 'comments',
            populate: {
                path: 'user',
            },
        });
        if (!book) {
            res.render('error/404', {
                title: 'Книга не найдена',
                isAuth: req.isAuthenticated(),
            });
            return;
        }

        try {
            const data = await fetch(`${COUNTER_URL}/counter/${id}/incr`, {
                method: 'POST',
            }).then((res) => res.json());
            res.render('books/view', {
                title: 'Книга',
                book,
                cnt: data.cnt,
                isAuth: req.isAuthenticated(),
                comments: book.comments.map(comment => {
                    comment.user = userMapper(comment.user);
                    return comment;
                }),
            });
        } catch (e) {
            res.render('error/404', {
                title: 'Ошибка redis',
                isAuth: req.isAuthenticated(),
            });
        }
    } catch (e) {
        res.render('error/404', {
            title: 'Ошибка сервера',
            isAuth: req.isAuthenticated(),
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.render('books/index', {
            title: 'Список книг',
            books: books,
            isAuth: req.isAuthenticated(),
        });
    } catch (e) {
        res.render('error/404', {
            title: 'Ошибка сервера',
            isAuth: req.isAuthenticated(),
        });
    }
});

module.exports = router;
