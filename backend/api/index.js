const express = require('express');
const userRoutes = require('./user/user.routes');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'API'
    });
});

router.use('/user', userRoutes);

module.exports = router;