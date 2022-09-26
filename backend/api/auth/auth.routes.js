const express = require('express');
const bcrypt = require('bcrypt');

const userSchema = require('../users/users.schema');
const userQueries = require('../users/users.queries');
const query = require('./auth.queries');

const slugify = require('../../utils/slugify');

const router = express.Router();

router.post('/signup', async (req, res, next) => {
    const { error } = userSchema.validate(req.body);

    if (error) {
        res.status(400);
        return next(error);
    }

    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const username = slugify(req.body.username);
        const body = {
            username: username,
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
        const user = await userQueries.get('*', { email });

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

router.get('/logout', (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            return next(error);
        }

        res.json({ message: 'Successfully logged out.' });
    });
});

module.exports = router;