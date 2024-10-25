import * as supertest from 'supertest'
import {user} from "../../data/user";
const request = supertest("http://localhost:8001/api/v1")

describe('USER SIGNUP', () => {

    describe('positive testing', () => {

        it.skip("Create a new user", async () => {
            const res = await request.post('/users/signup')
                .send( {
                    "name": "Mike",
                    "email": "mike6666@mail.com",
                    "password": "029721275hh",
                    "passwordConfirm": "029721275hh"
                } ).expect(201);

            expect(res.body.data.user.name).toBe('Mike');
            expect(res.body.data.user.email).toBe("mike6666@mail.com"); // it was Jest
            expect(res.body.status).toBe('success');

            // would be better to delete created user after each test make by myself
            console.log(res.body, ':-res');
        })

        it("Create a new user", async () => {
            const res = await request.post('/users/signup')
                .send( user ).expect(201);

            expect(res.body.data.user.name).toBe('Mike');
            expect(res.body.data.user.email).toBe("mike777@mail.com"); // it was Jest
            expect(res.body.status).toBe('success');
            console.log(res.body, ':-res');
        })

        it("Create a new user using faker", async () => {
            const res = await request.post('/users/signup')
                .send( user ).expect(201);

            expect(res.body.data.user.name).toBe(user.name);
            expect(res.body.data.user.email).toBe(user.email.toLowerCase()); // it was Jest
            expect(res.body.status).toBe('success');
            console.log(res.body, ':-res');
        })

        it("Create a new user using other method ",   function(done) {
            const res =  request.post('/users/signup')
                .send( user ).expect(201)
                .end( function(err, res ){
                    if(err) return done(err);
                    expect(res.body.data.user.name).toBe(user.name);
                    expect(res.body.data.user.email).toBe(user.email.toLowerCase()); // it was Jest
                    expect(res.body.status).toBe('success');
                    return done();
                })

        })

    })
    describe('negative testing', () => {
        it.only('should not create a new user with existing email', async () => {
            const res = await request.post('/users/signup')
                .send( {"name": "Mike",
                "email": "mike6666@mail.com",
                "password": "029721275hh",
                "passwordConfirm": "029721275hh" }).expect(500);
            expect(res.body.status).toBe('error');
            expect(res.body.message).toBe("E11000 duplicate key error collection: test.users index: email_1 dup key: { email: \"mike6666@mail.com\" }");

        })
    })



})