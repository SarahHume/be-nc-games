const express = require("express");
const { getCategories } = require("./controllers/apiCategoriesControllers.js");
const { invalidPath } = require("./controllers/errorHandlingControllers.js");

const app = express();

app.get("/api/categories", getCategories);

app.get("*", invalidPath);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Server Error!' });
  });

module.exports = { app };