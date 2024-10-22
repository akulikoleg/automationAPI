import * as supertest from 'supertest'
import {user} from "../../data/user";
const request = supertest("http://localhost:8001/api/v1")

describe('USER SIGNUP', () => {

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
        // would be better to delete created user after each test make by myself
       console.log(res.body, ':-res');
    })

})