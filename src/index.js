const express = require('express');
const cors = require('cors');
const path = require('path');

const { booksApiRouter, userApiRouter } = require('./routes/api');
const indexRouter = require('./routes');
const booksRouter = require('./routes/books');
const { notFoundMiddleware, errorMiddleware } = require('./middleware');

const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Starting the server to http://localhost:${PORT}`);
});

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    req.rootDir = path.join(path.resolve(__dirname));
    next();
})

app.get('/api/err', (req, res) => {
    throw new Error('get error');
});

app.use('/api/user', userApiRouter);
app.use('/api/books', booksApiRouter);

app.use('/public', express.static(path.join(path.resolve(__dirname), '..', '/public')));
app.use('/books', booksRouter);
app.use('/', indexRouter);

app.use(notFoundMiddleware);

app.use(errorMiddleware);