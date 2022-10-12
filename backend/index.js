require('dotenv').config();
const express = require('express');
const cors = require('cors');

const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const expressSession = require('./config/session');
const api = require('./api');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}));
const port = process.env.PORT || 5000;
app.use(expressSession);
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Home'
    });
});

app.use('/api/v1', api);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Listening to port ${port}`));