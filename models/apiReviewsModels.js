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
        if (result.rowCount === 0) {
            return Promise.reject( { status: 404, msg: "Review ID does not exist" } );
        }
        return result.rows;
    })
}