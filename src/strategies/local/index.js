const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../../models');

async function verify(login, password, done) {
    try {
        const user = await User.findOne({ login });

        if (!user) {
            return done(null, false, { message: 'Пользователь не найден' });
        }
        if (!user.checkPassword(password)) {
            return done(null, false, { message: 'Не верный пароль' });
        }
        return done(null, user);
    } catch (e) {
        done(e);
    }
}

const options = {
    usernameField: 'login',
    passwordField: 'password',
    passReqToCallback: false,
};

function serializeUser(user, cb) {
    cb(null, user._id);
}

async function deserializeUser(id, cb) {
    try {
        const user = await User.findById(id, { name: 1, surname: 1 });

        if (!user) {
            return cb(null, false);
        }
        return cb(null, user);
    } catch (e) {
        cb(e);
    }
}

passport.use('local', new LocalStrategy(options, verify));
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

module.exports = {
    initedPassport: passport,
};
