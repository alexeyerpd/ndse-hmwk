module.exports = function userMapper(user) {
    return {
        id: user._id,
        name: user.name,
        surname: user.surname,
    };
};
