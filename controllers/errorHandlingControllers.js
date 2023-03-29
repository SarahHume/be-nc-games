exports.invalidPath = (req, res) => {
    res.status(404).send({ msg: "Invalid path"});
}