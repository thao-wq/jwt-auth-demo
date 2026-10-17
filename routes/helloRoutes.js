const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/auth', authMiddleware, (req, res) => {
    res.json({
        message: 'Token hop le',
        user: req.user
    });
});

router.get('/hello', authMiddleware, (req, res) => {
    res.send('Hello World');
});

module.exports = router;