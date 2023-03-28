const { fetchCategories } = require("../models/apiCategoriesModels");

exports.getCategories = (req, res) => {
    fetchCategories()
    .then((result) => {
        console.log("I'm out of the model now!");
        console.log("result in controller", result);
        res.status(200).send({categories: result});
    })
};