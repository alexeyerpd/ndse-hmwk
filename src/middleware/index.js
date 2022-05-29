const notFoundMiddleware = require('./not-found.js');
const errorMiddleware = require('./error.js');
const fileMiddleware = require('./file.js');
const fDParserMiddleware = require('./formDataParser');
const ensureAuthenticated = require('./ensureAuthenticated');
const saveReturnToFromSession = require('./saveReturnToFromSession');

module.exports = {
    notFoundMiddleware,
    errorMiddleware,
    fileMiddleware,
    fDParserMiddleware,
    ensureAuthenticated,
    saveReturnToFromSession,
};
