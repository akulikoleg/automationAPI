import * as supertest from 'supertest';
import { getUser } from "../../data/user";
import {logIn, logIn2, signUp} from "../../data/helpers";
const request = supertest("http://localhost:8001/api/v1");
import 'dotenv/config';

describe('LOGIN', () => {

    // afterEach( async () => {
    //     await request.delete("/deleteMe").send();
    // })
// ask Michael about too many request

    describe('positive testing', () => {
        let user = getUser();

        beforeEach( async() => {
            await signUp(user);
        })

        afterEach( async () => {

            await request.delete("/users/deleteMe").send().set("Authorization", `Bearer ${process.env.JWT}`).then(del => {
                console.log("Deleted!!", del.body)
            });
        })

        it('should login user using then', async () => {
            await logIn({
                "email": user.email,
                "password": user.password
            }).then( async (res) => {

                expect(res.body.status).toBe("success");
                expect(res.body.data.user.role).toBe("user");
                expect(res.body.token).toBeDefined();
                process.env.JWT = res.body.token;

            });



        });

        it('should login user using try catch',  async () => {
            try{
               await logIn({
                    "email": user.email,
                    "password": user.password
                }).then((res1) => {

                    expect(res1.body.status).toBe("success");
                    expect(res1.body.data.user.photo).toBe("default.jpg");
                    expect(res1.body.token).toBeDefined();
                    process.env.JWT = res1.body.token;
               })

            }
            catch(error){
                console.log("Error during login process", error)
            }
        })

        it("should login user using .end()", (done) => {
             logIn2({
                "email": user.email,
                "password": user.password
            }).end( (err, res3) => {
                if(err) return done(err);
                 expect(res3.body.status).toBe("success");
                 expect(res3.body.data.user.photo).toBe("default.jpg");
                 expect(res3.body.token).toBeDefined();
                 process.env.JWT = res3.body.token;
                 done();
             })
        })


    });

    describe.skip('negative tests', () => {

        let user = getUser();

        it("get error when trying login without password", async () => { // using async await
            const signupRes = await request.post("/users/signup").send(user).expect(201);
            const loginRes = await request.post("/users/login").send({
                email: user.email
            }).expect(400);
            expect(loginRes.body.message).toBe("Please provide email and password!");

        });

        it("get error when trying login without username", () => { // using hooks .then()

            request.post("/users/signup").send(user).expect(201);

            request.post("/users/login")
                .send({
                    password: user.password
                })
                .then( el => {
                    expect(el.body.status).toBe("fail");
                    expect(el.body.message).toBe("Please provide email and password!");
                })

        });

        it("get error when trying login with wrong password", (done) => {

            request.post("/users/signup").send(user).expect(201);
            // .end( (err, res ) => {
            //     if(err) return done(err);
            //     expect(res.body.status).toBe("success");
            //     return done();
            // });

            request.post("/users/login")
                .send({
                    email: user.email,
                    password: "wrongpass"
                })
                .expect(401)
                .end( (err, res) => {
                    if(err) return done(err);
                    expect(res.body.status).toBe("fail");
                    expect(res.body.message).toBe("Incorrect email or password");
                    return done();
                })

        });

        it("get error when trying login with wrong username",  () => {

            request.post("/users/signup").send(user).expect(201);

            return new Promise((resolve, reject) => {
                request
                    .post("/users/login")
                    .send({
                        email: "wrongemail",
                        password: user.password
                    })
                    .expect(401)
                    .end((err, res) => {
                        if(err) console.log(err);
                        expect(res.body.status).toBe("fail");
                        expect(res.body.message).toBe('Incorrect email or password');
                        return resolve(res);
                    })
            })

        });


    });
});