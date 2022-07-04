const express = require('express');
const bcrypt = require('bcrypt');
const query = require('./user.queries');
const userSchema = require('./user.schema');
const checkAuth = require('../../middleware/checkAuth');

const router = express.Router();

router.post('/signup', async (req, res, next) => {
    const { error } = userSchema.validate(req.body);

    if (error) {
        res.status(400);
        return next(error);
    }

    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const body = {
            username: req.body.username,
            email: req.body.email,
            password: hash,
            avatar: req.body.avatar
        };

        const user = await query.signUp(body);

        res.json({ message: 'Account registered successfully.' });
    } catch (error) {
        return next(error);
    }
});

router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required.' });
    }

    try {
        const user = await query.get(['*'], { email });

        if (!user.length) {
            res.status(401);
            return next(new Error('Email or password incorrect.'));
        }

        const match = await bcrypt.compare(password, user[0].password);

        if (user.length && match) {
            req.session.loggedin = true;
            req.session.user = {
                id: user[0].id,
                username: user[0].username
            };
            res.json(req.session.user);
        } else {
            res.status(401);
            return next(new Error('Email or password incorrect.'));
        }

    } catch (error) {
        return next(error);
    }
});

router.put('/edit', checkAuth, async (req, res, next) => {
    try {
        const user = await query.get(['id', 'username'], { username: req.body.username });

        if (user.length && user[0].id !== req.session.user.id) {
            res.status(409);
            return next(new Error('Username already exists. Please choose another one.'));
        }

        const result = await query.update({
            username: req.body.username,
            avatar: req.body.avatar
        }, req.session.user.id);

        if (result.affectedRows === 0) {
            throw new Error('Something went wrong!');
        }

        res.json({ message: 'Your changes have been saved.' });
    } catch (error) {
        next(error);
    }
});

router.get('/logout', (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            return next(error);
        }

        res.json({ message: 'Successfully logged out.' });
    });
});

router.get('/:username', checkAuth, async (req, res, next) => {
    const user = await query.get(['id', 'username', 'email', 'avatar'], { username: req.params.username });

    if (user.length) {
        return res.json(user);
    }

    return next();
});

module.exports = router;