const express = require('express');

const query = require('./users.queries');
const checkAuth = require('../../middleware/checkAuth');
const slugify = require('../../utils/slugify');

const router = express.Router();

router.put('/edit', checkAuth, async (req, res, next) => {
    try {
        const user = await query.get(['id', 'username'], { username: req.body.username });

        if (user.length && user[0].id !== req.session.user.id) {
            res.status(409);
            return next(new Error('Username already exists. Please choose another one.'));
        }
        const username = slugify(req.body.username);
        const result = await query.update({
            username: username,
            avatar: req.body.avatar
        }, {
            id: req.session.user.id
        });

        if (result.affectedRows === 0) {
            throw new Error('Something went wrong!');
        }

        res.json({ message: 'Your changes have been saved.' });
    } catch (error) {
        next(error);
    }
});

router.get('/:username', async (req, res, next) => {
    const user = await query.get(['username', 'avatar'], { username: req.params.username });

    if (user.length) {
        return res.json(user);
    }

    return next();
});

module.exports = router;