const express = require('express');
const { saveReturnToFromSession } = require('../../middleware');
const { User } = require('../../models');
const { initedPassport } = require('../../strategies/local');

const router = express.Router();

router.get('/logout', (req, res) => {
    req.logout(function () {});
    res.redirect('/');
});

router.get('/me', (req, res) => {
    const { user } = req;
    if (user) {
        const userData = {
            name: user.name,
            surname: user.surname,
        };
        res.json({ success: true, data: userData })
    } else {
        res.json({success: false})
    }
});

router.post(
    '/login',
    saveReturnToFromSession,
    initedPassport.authenticate('local', {
        successRedirect: '',
        failureRedirect: '/login',
        failureMessage: true,
    }),
    (req, res) => {
        if (req.returnTo) {
            return res.redirect(req.returnTo);
        }
        res.redirect('/');
    },
);

router.post('/signup', async (req, res) => {
    const { login, password, name, surname } = req.body;

    try {
        const user = await User.findOne({ login });

        if (user) {
            res.render('signup/index', {
                title: 'Регистрация',
                isAuth: req.isAuthenticated(),
                error: 'Такой пользователь уже существует',
            });
            return;
        }

        const newUser = new User({
            login,
            password,
            name,
            surname,
        });

        await newUser.save();

        res.redirect('/login');
    } catch (e) {
        console.error('не вышло');
        res.render('signup/index', {
            title: 'Регистрация',
            isAuth: req.isAuthenticated(),
            error: 'Произошла непредвиденная ошибка',
        });
    }
});

module.exports = router;
