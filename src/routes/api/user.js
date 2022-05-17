const express = require('express');
const router = express.Router();

const { sendJsonByStatus } = require('../../utils');

const user = { id: 1, mail: 'test@mail.ru' };

router.post('/login', (req, res) => {
    sendJsonByStatus(res, user, 201);
});

module.exports = router;
