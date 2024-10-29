import * as supertest from 'supertest'
import {user} from "../../data/user";
import {logIn, signUp} from "../../data/helpers";
const request = supertest("http://localhost:8001/api/v1")


describe('LOGIN', () => {

    describe('positive testing', () => {

        it('should login user', async () => {

            const res = await signUp(user);
            // const loginRes = await request.post("/users/login")
            //     .send({
            //         "email": user.email,
            //         "password": user.password,
            //     }).expect(200);

            const loginRes = await logIn({
                "email": user.email,
                "password": user.password,
            })
        });

    });

    describe('negative tests', () => {

        it("get error when trying login without password");
// use all other methods
        it("get error when trying login without username");

        it("get error when trying login with wrong password");
      //as well use hooks .then() .catch()  can't use it with async await
        it("get error when trying login with wrong username");
    });
});