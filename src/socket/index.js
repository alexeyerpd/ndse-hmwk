const socketIO = require('socket.io');
const { Book, Comment } = require('../models');

function socket(
    server,
    sessionMiddleware,
    initializeMiddleware,
    pasportSessionMiddleware,
) {
    const io = socketIO(server);

    io.use(sessionMiddleware);
    io.use(initializeMiddleware);
    io.use(pasportSessionMiddleware);

    io.use(async (socket, next) => {
        const query = socket.handshake.query;
        const user = socket.request.user;

        socket.data.user = user;
        socket.data.bookId = query.bookId;

        if (!user) return next(new Error('incorrect session, please relogin'));

        next();
    });

    io.on('connection', (socket) => {
        const { user, bookId } = socket.data;

        socket.on('add-message', async (message) => {
            try {
                const book = await Book.findById(bookId);
                const comment = new Comment({
                    user: user._id,
                    book: book._id,
                    date: new Date(),
                    text: message,
                });

                const populatedComment = await (
                    await comment.save()
                ).populate({ path: 'user', select: { name: 1, surname: 1 } });

                book.comments = book.comments.concat(comment._id);
                await book.save();

                socket.broadcast.emit('comment', populatedComment);
                socket.emit('comment', populatedComment);
            } catch (e) {
                console.log(e, ' coket error');
            }
        });

        socket.on('disconnect', () => {
            console.log('disconnect');
        });
    });

    return io;
}

module.exports = socket;
