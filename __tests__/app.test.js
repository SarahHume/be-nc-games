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
                const { categories } = response.body;
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

describe("/api/reviews/:review_id", () => {
    test("GET 200: should response with a review object", () => {
        return request(app)
            .get("/api/reviews/3")
            .expect(200)
            .then((response) => {
                const { review } = response.body;
                expect(review).toMatchObject({
                    review_id: expect.any(Number),
                    title: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    review_img_url: expect.any(String),
                    review_body: expect.any(String),
                    category: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number)
                });
                expect(review.review_id).toBe(3);
            });
    });
    test("ERROR 404: Review ID does not exist", () => {
        return request(app)
            .get("/api/reviews/5000")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Review ID does not exist");
            })
    })
    test("ERROR 400: Bad request", () => {
        return request(app)
            .get("/api/reviews/banana")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            })
    })
});

describe("Error - invalid path", () => {
    test("404: responds with an error message when given a request for an invalid path", () => {
        return request(app)
            .get("/banana")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid path");
            });
    });
});