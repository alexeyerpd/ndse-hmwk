const uuid = require('uuid').v4;

class Book {
    constructor(
        title = '',
        description = '',
        authors = '',
        favorite = false,
        fileName = '',
        fileBook = '',
        fileCover = '',
        id = uuid(),
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileName = fileName;
        this.fileBook = fileBook;
        this.fileCover = fileCover;
    }
}

module.exports = {
    Book,
};
