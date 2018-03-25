const request = require('supertest');
const _ = require('lodash');
const app = require('../app');
const data = {
    title: "hello",
    content: "world"
}
let createdData = null;

describe("POST /todo", () => {
    it('Should return 201 status code', (done) => {
        request(app).post('/todo').send(data).expect(201, (err, res) => {
            if(err) return done(err);
            
            createdData = res.body;
            done();
        });
    });
});

describe("PUT /todo/:id", () => {
    it('Should return 200 status code', (done) => {
        request(app).put(`/todo/${createdData.createdAt}`).send(_.assign(data, {
            content: "world. Successfully modified!"
        })).expect(200, done);
    });
});

describe("GET /todo", () => {
    it('Should return 200 status code', (done) => {
        request(app).get('/todo').expect(200).end((err, res) => {
            if(err) return done(err);
            
            console.log(res.body);
            done();
        });
    });
});

describe("GET /todo/:createdAt", () => {
    it('Should return 200 status code', (done) => {
        request(app).get(`/todo/${createdData.createdAt}`).expect(200).end((err, res) => {
            if(err) return done(err);
            
            console.log(res.body);
            done();
        });
    });
});

describe("DELETE /todo/:id", () => {
    it('Should return 204 status code', (done) => {
        request(app).delete(`/todo/${createdData.createdAt}`).send(data).expect(204, done);
    });
});