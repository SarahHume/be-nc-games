const db = require("../db/connection.js");

exports.fetchReviews = () => {
    return db.query(
        "SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id ORDER BY created_at ASC")
    .then((result) => {
        return result.rows;
    })
}

exports.fetchReviewById = (review_id) => {
    return db.query("SELECT * FROM reviews WHERE review_id = $1", [review_id])
    .then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject( { status: 404, msg: "Review ID does not exist" } );
        }
        return result.rows;
    })
}

exports.fetchCommentsById = (review_id) => {
    return db.query("SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC", [review_id])
    .then((result) => {
        return result.rows;
    })
}

exports.checkReviewExists = (review_id) => {
    return db.query("SELECT * FROM reviews WHERE review_id = $1", [review_id])
    .then((result => {
        if (result.rowCount === 0) {
            return Promise.reject( { status: 404, msg: "Review ID does not exist" } );
        }
    }))
}

exports.insertComment = (review_id, reqBody) => {
    const date = new Date()
    const author = reqBody.username;
    const body = reqBody.body;
    const votes = 0;

    return db.query("INSERT INTO comments (votes, created_at, author, body, review_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;", [votes, date, author, body, review_id])
    .then((result) => {
        return result.rows;
    })
}

exports.updateReview = (review_id, reqBody) => {
    const voteInc = reqBody.inc_votes;
    return db.query("UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;", [voteInc, review_id])
    .then((result) => {
        return result.rows;
    })
}