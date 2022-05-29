const express = require('express');
const { ensureAuthenticated } = require('../../middleware');

const router = express.Router();

router.get('/', ensureAuthenticated, (req, res) => {
    const { user } = req;
    res.render('profile/index', {
        title: 'Профиль',
        isAuth: req.isAuthenticated(),
        user,
    });
});

module.exports = router;
