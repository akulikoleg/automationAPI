import * as supertest from 'supertest';
import { getUser } from "../../data/user";
import {logIn, logIn2, signUp} from "../../data/helpers";
const request = supertest("http://localhost:8001/api/v1");
import 'dotenv/config';

describe('LOGIN', () => {

    describe('positive testing', () => {

        let user = getUser();
        beforeEach( async() => {
            await signUp(user);
        })

        afterEach(  async () => {
            await request.delete("/users/deleteMe").send().set("Authorization", `Bearer ${process.env.JWT}`).then(del => {
                console.log("Deleted!!", del.body)
            });

        })

        it('should login user using .then',  async () => {
           await logIn({
                "email": user.email,
                "password": user.password
            }).then(  res => {

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
                }).then( res1  => {
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

    describe('negative tests', () => {

        let user = getUser();  // ASK Misha if it makes sence use beforeALL and AfterAll
        beforeAll( async() => {
            await signUp(user);
        })

        afterAll( async () => {
            const loggedRes = await logIn(user);
            process.env.JWT = loggedRes.body.token;
            const delResp = await request.delete("/users/deleteMe").send().set("Authorization", `Bearer ${process.env.JWT}`);
            //console.log(delResp);
        })

        it("get error when trying login without password - using .then()",  () => { // using async await

            logIn({
                email: user.email
            }).then( res => {
                expect(res.statusCode).toBe(400);
                expect(res.body.message).toBe("Please provide email and password!");
            }).catch(err => console.log("Error on login stage:" + err));


        });

        it("get error when trying login without username using .end()", (done) => { // using hooks .then()

            logIn2({ password: user.password })
                .end( (err, res4) => {
                    if(err) return done(err);
                    expect(res4.body.status).toBe("fail");
                    expect(res4.statusCode).toBe(400);
                    expect(res4.body.message).toBe("Please provide email and password!");
                    done();
                })

        });

        it("get error when trying login without username using async await", async () => { // using hooks .then()

            const res4 = await logIn2({ password: user.password });

                    expect(res4.body.status).toBe("fail");
                    expect(res4.statusCode).toBe(400);
                    expect(res4.body.message).toBe("Please provide email and password!");


        });

        it("get error when trying login with wrong password using .end()", (done) => {

            logIn2({
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

        it("get error when trying login with wrong username - using PROMISE",  () => {


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

        it("get error when trying login with wrong username using try catch blocks",  () => {

            try{
                logIn({
                    email: "wrongemail",
                    password: user.password
                }).then(res => {
                    expect(res.body.status).toBe("fail");
                    expect(res.body.message).toBe('Incorrect email or password');
                })
            }
            catch(error){
                console.log(error, "!!!ERROR!!!")
            }

        });
    });
});