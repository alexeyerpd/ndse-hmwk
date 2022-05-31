const { model, Schema } = require('mongoose');

const commentSchema = new Schema({
    user: { type: 'ObjectId', ref: 'User' },
    book: { type: 'ObjectId', ref: 'Book' },
    date: Date,
    text: String,
});

module.exports = model('Comment', commentSchema);
