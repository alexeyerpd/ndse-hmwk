const uuid = require('uuid').v4;

class Book {
    constructor(title, description, authors, id = uuid()) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = "";
        this.fileCover = "";
        this.fileName = "";
    }
}

module.exports = {
    Book,
}
