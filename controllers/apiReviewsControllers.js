const { fetchReviewById } = require("../models/apiReviewsModels.js");

exports.getReviewById = (req, res, next) => {
    const review_id = req.params.review_id;
    fetchReviewById(review_id)
    .then((result) => {
        res.status(200).send({review: result[0]});
    })
    .catch((err) => {
        next(err);
    })
}