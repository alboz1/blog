const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const connection = require('../config/db');

const sessionStore = new MySQLStore({}, connection.promise());

const expressSession = session({
    secret: process.env.SESSION_KEY,
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 86400000,
        secure: process.env.NODE_ENV === 'production' ? true: false,
        httpOnly: true
    }
});

module.exports = expressSession;