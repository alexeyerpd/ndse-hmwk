const express = require('express');
const cors = require('cors');

const { booksRouter, userRouter } = require('./routes');
const { notFoundMiddleware, errorMiddleware } = require('./middleware');

const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Starting the server to http://localhost:${PORT}`);
});

app.use(express.json());
app.use(cors());

app.get('/api/err', (req, res) => {
    throw new Error('get error');
});

app.use('/api/user', userRouter);
app.use('/api/books', booksRouter);

app.use(notFoundMiddleware);

app.use(errorMiddleware);
