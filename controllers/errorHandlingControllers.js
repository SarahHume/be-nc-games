exports.customErrors = (err, req, res, next) => {
    const { status, msg } = err;
    if (status && msg) {
        res.status(status).send( { msg } );
    } else {
        next(err);
    }
};

exports.psqlBadRequest = (err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad request" });
    } else if (err.code === "23502") {
        res.status(400).send({ msg: "Bad request" })
    } else {
        next(err);
    }
}

exports.invalidPath = (req, res) => {
    res.status(404).send({ msg: "Invalid path"});
}