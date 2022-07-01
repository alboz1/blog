function notFound(req, res, next) {
    const error = new Error('Not found');

    res.status(404);
    next(error);
}

module.exports = notFound;