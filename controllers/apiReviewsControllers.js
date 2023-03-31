const { fetchReviews, fetchReviewById, fetchCommentsById, checkReviewExists, insertComment, updateReview } = require("../models/apiReviewsModels.js");

exports.getReviews = (req, res) => {
    fetchReviews()
    .then((result) => {
        res.status(200).send({reviews: result});
    })
}

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

exports.getCommentsById = (req, res, next) => {
    const review_id = req.params.review_id;
    const commentsPromises = [fetchCommentsById(review_id), checkReviewExists(review_id)];
    Promise.all(commentsPromises)
        .then((result) => {
            res.status(200).send({comments: result[0]});
        })
        .catch((err) => {
            next(err);
        })
}

exports.postComment = (req, res, next) => {
    const review_id = req.params.review_id;
    checkReviewExists(review_id)
    .then(() => {
        return insertComment(review_id, req.body)
    })
    .then((result) => {
        res.status(201).send({comment: result[0]});
    })
    .catch((err) => {
        next(err);
    })
}

exports.patchReview = (req, res, next) => {
    const review_id = req.params.review_id;
    checkReviewExists(review_id)
    .then(() => {
        return updateReview(review_id, req.body)
    })
    .then((result) => {
        res.status(200).send({review: result[0]});
    })
    .catch((err) => {
        next(err);
    })
}