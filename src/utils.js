const { ERROR_MESSAGES_DICT } = require('./constants');

function compareCurrentBookWithBody(book, body) {
    if (Object.keys(body).length) {
        return Object.entries(body).filter(
            ([fieldK, fieldV]) => book[fieldK] !== fieldV,
        );
    }
    return [];
}

function getUpdatedNewBook(book, body) {
    const newBook = { ...book };
    for (let [k, v] of Object.entries(body)) {
        if (typeof v !== 'undefined') {
            newBook[k] = v;
        }
    }
    return newBook;
}

function getResponseBody(data, statusCode) {
    return (
        ERROR_MESSAGES_DICT[statusCode] || {
            success: true,
            ...(data && { data }),
        }
    );
}

function sendJsonByStatus(response, data, statusCode = 200) {
    response.status(statusCode);
    response.json(getResponseBody(data, statusCode));
}

module.exports = {
    getUpdatedNewBook,
    sendJsonByStatus,
    compareCurrentBookWithBody,
};