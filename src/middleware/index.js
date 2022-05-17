const notFoundMiddleware = require('./not-found.js');
const errorMiddleware = require('./error.js');
const fileMiddleware = require('./file.js');

module.exports = {
    notFoundMiddleware,
    errorMiddleware,
    fileMiddleware,
};
