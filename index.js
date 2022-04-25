const express = require('express');
const os = require('os');
const formData = require('express-form-data');
const { Book } = require('./models');

const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Starting the server to http://localhost:${PORT}`);
})

const options = {
    uploadDir: os.tmpdir(),
    autoClean: true,
  };

app.use(express.json());
app.use(formData.parse(options));
app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());

function getUpdatedNewBook(book, body) {
    const newBook = { ...book };
    for (let [k, v] of Object.entries(body)) {
        if (typeof v !== 'undefined') {
            newBook[k] = v;
        }
    }
    return newBook;
};

const store = {
    books: [
        new Book('title', 'description', 'authors', '3336a1e6-9c91-48e0-b374-608bba451696'),
    ],
};

app.post('/api/user/login', (req, res) => {
    res.statusCode = 201;
    res.json({ id: 1, mail: "test@mail.ru" })
});

app.get('/api/books', (req, res) => {
    res.json(store.books);
});

app.get('/api/books/:id', (req, res) => {
    const { id } = req.params;
    const book = store.books.find( item => item.id === id);

    if (!book) {
        res.sendStatus = 404;
        res.json('Code: 404');
        return;
    } 

    res.json(book);
});

app.post('/api/books', (req, res) => {
    const { authors, title, description } = req.body;
    const book = new Book(title, description, authors);

    store.books.push(book);

    res.statusCode = 201;
    res.json(book);
});

app.put('/api/books/:id', (req, res) => {
    const { id } = req.params;
    const index = store.books.findIndex((item) => item.id === id);

    if (index === -1) {
        res.statusCode = 404;
        res.json('Code: 404');
        return;
    }

    store.books[index] = getUpdatedNewBook(store.books[index], req.body);

    res.json(store.books[index]);

});

app.delete('/api/books/:id', (req, res) => {
    const { id } = req.params;
    const index = store.books.findIndex((item) => item.id === id);

    if (index === -1) {
        res.statusCode = 404;
        res.json('Code: 404');
        return;
    }

    store.books.splice(index, 1);
    res.json('Ok');
});
