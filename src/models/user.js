const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    login: String,
    password: String,
    name: String,
    surname: String,
});

userSchema.methods.checkPassword = function checkPassword(password) {
    return this.password === password;
};

module.exports = model('User', userSchema);
