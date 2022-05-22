module.exports = function (book = {}) {
    const { favorite, ...other } = book;
    return { ...other, favorite: Boolean(favorite) };
};
