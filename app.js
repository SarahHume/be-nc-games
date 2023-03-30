const express = require("express");
const { getCategories } = require("./controllers/apiCategoriesControllers.js");
const { getReviews } = require("./controllers/apiReviewsControllers.js");
const { getReviewById } = require("./controllers/apiReviewsControllers.js");
const { invalidPath } = require("./controllers/errorHandlingControllers.js");
const { customErrors } = require("./controllers/errorHandlingControllers.js");
const { psqlBadRequest } = require("./controllers/errorHandlingControllers.js");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.get("*", invalidPath);

app.use(customErrors);

app.use(psqlBadRequest);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Server Error!' });
  });

module.exports = { app };