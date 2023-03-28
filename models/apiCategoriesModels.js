const db = require("../db/connection.js");

exports.fetchCategories = () => {
    console.log("Look, I'm in the model!");
    return db.query("SELECT * FROM categories")
    .then((result) => {
        console.log("result in model", result.rows);
        return result.rows;
    })
}