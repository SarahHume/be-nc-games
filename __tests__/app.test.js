const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection.js");
const { app } = require("../app.js");

beforeEach(() => seed(testData));

afterAll(() => {
    return db.end();
});

describe("/api/categories", () => {
    test("GET 200: should respond with an array of all category objects", () => {
        return request(app)
            .get("/api/categories")
            .expect(200)
            .then((response) => {
                console.log("raw response in test", response);
                const { categories } = response.body;
                console.log("categories in test", categories);
                expect(categories).toHaveLength(4);
                categories.forEach((category) => {
                    expect(category).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String)
                    });
                });
            });
    });
});