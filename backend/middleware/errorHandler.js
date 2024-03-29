function errorHandler(error, req, res, next) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode);
    res.json({
        status: statusCode,
        message: res.statusCode === 500 ? 'Oops! Something went wrong.' : error.message,
        stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
}

module.exports = errorHandler;