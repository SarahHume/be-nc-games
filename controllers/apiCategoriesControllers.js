const { fetchCategories } = require("../models/apiCategoriesModels");

exports.getCategories = (req, res) => {
    fetchCategories()
    .then((result) => {
        res.status(200).send({categories: result});
    })
};