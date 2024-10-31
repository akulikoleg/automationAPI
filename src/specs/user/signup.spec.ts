import * as supertest from 'supertest'
import {getUser} from "../../data/user";
import {logIn} from "../../data/helpers";
const request = supertest("http://localhost:8001/api/v1")

describe('USER SIGNUP', () => {

    describe('positive testing', () => {

        const userImport = getUser();

        //need to delete database before running each test
        afterEach( async () => {
            await logIn({
                "email": userImport.email,
                "password": userImport.password
            });
            await request.delete("users/deleteMe");

        })

        it.skip("Create a new user", async () => { // only for use without afterEach
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
            //console.log(res.body, ':-res');
        })

        it("Create a new user thru import test-data", async () => {
            const res = await request.post('/users/signup')
                .send( userImport ).expect(201);

            expect(res.body.data.user.name).toBe(userImport.name);
            expect(res.body.data.user.email).toBe(userImport.email.toLowerCase()); // it was Jest
            expect(res.body.status).toBe('success');
            //console.log(res.body, ':-res');
        })

        // it("Create a new user using faker", async () => {
        //     const res = await request.post('/users/signup')
        //         .send( userImport ).expect(201);
        //
        //     expect(res.body.data.user.name).toBe(userImport.name);
        //     expect(res.body.data.user.email).toBe(userImport.email.toLowerCase()); // it was Jest
        //     expect(res.body.status).toBe('success');
        //     console.log(res.body, ':-res');
        // })

        it("Create a new user using other method async",   function(done) {
            const res =  request.post('/users/signup')
                .send( userImport )//.expect(201)
                .end( function(err, res ){
                    if(err) return done(err);
                    expect(res.body.data.user.name).toBe(userImport.name);
                    expect(res.body.data.user.email).toBe(userImport.email.toLowerCase()); // it was Jest
                    expect(res.body.status).toBe('success');
                    return done(res);
                })

        })

    })
    describe('negative testing', () => {

        it.skip('should not create a new user with existing email', async () => {
            const res = await request.post('/users/signup')
                .send( {"name": "Mike",
                "email": "mike6666@mail.com",
                "password": "029721275hh",
                "passwordConfirm": "029721275hh" }).expect(500);
            expect(res.body.status).toBe('error');
            expect(res.body.message).toBe("E11000 duplicate key error collection: test.users index: email_1 dup key: { email: \"mike6666@mail.com\" }");

        })

        it('should not create user with invalid email', async () => {
            const res = await request.post('/users/signup')
                .send({
                    "name": "Mike",
                    "email": "mike.mail.com",
                    "password": "029721275hh",
                    "passwordConfirm": "029721275hh"
                }).expect(500);
            expect(res.body.status).toBe('error');
            expect(res.body.message).toBe('User validation failed: email: Please provide a valid email');
        })

        it('should not create user with empty email', async () => {
            const res = await request.post('/users/signup')
                    .send({
                        "name": "Mike",
                        "email": "",
                        "password": "029721275hh",
                        "passwordConfirm": "029721275hh"
                    }).expect(500);
            expect(res.body.status).toBe('error');
            expect(res.body.message).toBe('User validation failed: email: Please provide your email');
        })

        it("Should not create user without name", async () =>  {
            const res = await request.post('/users/signup')
                .send({

                    "email": "oaculov@gggg.mail",
                    "password": "029721275hh",
                    "passwordConfirm": "029721275hh"
                }).expect(500);
            expect(res.body.status).toBe('error');
            expect(res.body.message).toBe('User validation failed: name: Please tell us your name!');
        })

        it("Should not create user without name", async () =>  {
            const res = await request.post('/users/signup')
                .send({
                    "email": "oaculov@gggg.mail",
                    "password": "029721275hh",
                    "passwordConfirm": "029721275hh"
                }).expect(500);
            expect(res.body.status).toBe('error');
            expect(res.body.message).toBe('User validation failed: name: Please tell us your name!');
        })

        it("Should not create user with different password & passwordConfirm", async () =>  {
            const res = await request.post('/users/signup')
                .send({
                    "name": "derek",
                    "email": "oaculov@gggg.mail",
                    "password": "029721275hh",
                    "passwordConfirm": "029721275"
                }).expect(500);
            expect(res.body.status).toBe('error');
            expect(res.body.message).toBe('User validation failed: passwordConfirm: Passwords are not the same!');  // ask Michail about return err messages
        })

    })

})