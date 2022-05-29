const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('login/index', {
        title: 'Login',
        isAuth: req.isAuthenticated(),
        error: req.session && req.session.messages?.pop(),
    });
});

module.exports = router;
