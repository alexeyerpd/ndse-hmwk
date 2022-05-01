const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'publick/img');
    },
    filename(req, file, cb) {
        cb(null, `${new Date().getTime()}-${file.originalname}`);
    },
});

module.exports = multer({ storage });
