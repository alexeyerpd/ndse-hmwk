const { model, Schema } = require('mongoose');

const bookSchema = new Schema({
    title: String,
    description: String,
    authors: String,
    favorite: Boolean,
    fileName: String,
    fileBook: String,
    fileCover: String,
});

module.exports = model('Book', bookSchema);
