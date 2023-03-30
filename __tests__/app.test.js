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

describe("/api/reviews", () => {
    test("GET 200: should respond with an array of all review objects", () => {
        return request(app)
            .get("/api/reviews")
            .expect(200)
            .then((response) => {
                const { reviews } = response.body;
                expect(reviews).toHaveLength(13);
            })
    })
    test("GET 200: returned object should be sorted by date", () => {
        return request(app)
            .get("/api/reviews")
            .expect(200)
            .then((response) => {
                const { reviews } = response.body;
                expect(reviews).toBeSortedBy("created_at");
            })

    })
    test("GET 200: returned objects should include a 'comment_count' value corresponding with the number of comments in the database with the same review ID", () => {
        return request(app)
            .get("/api/reviews")
            .expect(200)
            .then((response) => {
                const { reviews } = response.body;
                reviews.forEach((review) => {
                    expect(review).toMatchObject({
                        owner: expect.any(String),
                        title: expect.any(String),
                        review_id: expect.any(Number),
                        category: expect.any(String),
                        review_img_url: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        designer: expect.any(String),
                        comment_count: expect.any(Number)
                    })
                })
            })
    })
})

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

describe("/api/reviews/:review_id/comments", () => {
    test("should response with an array of comment objects for the given review_id, sorted by most recent first", () => {
        return request(app)
            .get("/api/reviews/3/comments")
            .expect(200)
            .then((response) => {
                const { comments } = response.body;
                expect(comments).toHaveLength(3)
                expect(comments).toBeSortedBy("created_at", {descending: true})
                comments.forEach((comment) => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        review_id: expect.any(Number)
                    })
                })
            })
    })
    test("GET 200: should return an empty array if passed a valid review ID with no associated comments without throwing an error", () => {
        return request(app)
            .get("/api/reviews/1/comments")
            .expect(200)
            .then((response) => {
                const { comments } = response.body;
                expect(comments).toHaveLength(0);
            })
    })
    test("ERROR 404: Review ID does not exist", () => {
        return request(app)
            .get("/api/reviews/5000/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Review ID does not exist");
            })
    })
    test("ERROR 400: Bad request", () => {
        return request(app)
            .get("/api/reviews/banana/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            })
    })
})

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