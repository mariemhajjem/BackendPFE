const { logEvents } = require('./logEvents');

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    /* console.error(err.stack)
    res.status(500).send(err.message); */

    if (req.headerSent) return next(err);
    res.status(err.code || 500);
    res.json({ message: err.message || "An unknow error occured!", code: err.code });

}

module.exports = errorHandler;