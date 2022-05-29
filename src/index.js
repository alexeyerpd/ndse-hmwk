const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const redisStorage = require('connect-redis')(session);
const redis = require('redis');

const { booksApiRouter, userApiRouter } = require('./routes/api');
const indexRouter = require('./routes');
const booksRouter = require('./routes/books');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const profileRouter = require('./routes/profile');
const {
    notFoundMiddleware,
    errorMiddleware,
    fDParserMiddleware,
} = require('./middleware');
const { initedPassport } = require('./strategies/local');

const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/lib';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const client = redis.createClient({ legacyMode: true, url: REDIS_URL });

(async () => {
    try {
        await client.connect().catch(console.error);
        await mongoose.connect(MONGO_URL);
        app.listen(PORT, () => {
            console.log(`Starting the server to http://localhost:${PORT}`);
        });
    } catch (e) {
        console.error(e);
    }
})();

app.use(express.json());
app.use(cookieParser());
app.use(
    session({
        store: new redisStorage({
            url: REDIS_URL,
            client,
        }),
        secret: process.env.COOKIE_SECRET || 'cookie-secret',
        resave: false,
        saveUninitialized: true,
    }),
);
app.use(cors());
app.use((req, res, next) => {
    req.rootDir = path.join(path.resolve(__dirname));
    req.rootPublicDir = path.join(path.resolve(__dirname), '..');
    next();
});

app.get('/api/err', (req, res) => {
    throw new Error('get error');
});

app.use(initedPassport.initialize());
app.use(initedPassport.session());

app.use('/api/user', fDParserMiddleware, userApiRouter);
app.use('/api/books', booksApiRouter);

app.use(
    '/public',
    express.static(path.join(path.resolve(__dirname), '..', '/public')),
);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/profile', profileRouter);
app.use('/books', booksRouter);
app.use('/', indexRouter);

app.use(notFoundMiddleware);

app.use(errorMiddleware);
