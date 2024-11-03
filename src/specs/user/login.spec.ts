import * as supertest from 'supertest';
import { getUser } from "../../data/user";
import {logIn, logIn2, signUp, signUp2} from "../../data/helpers";
const request = supertest("http://localhost:8001/api/v1");

describe('LOGIN', () => {

    describe('positive testing', () => {
        let user = null;
        beforeEach(async () => {
             user = getUser();
        })

        it('should login user', async () => {

            //const loginRes = await request.post("/users/login")
            //     .send({
            //         "email": user.email,
            //         "password": user.password,
            //     }).expect(200);

            const signUpRes = await signUp(user);
            expect(signUpRes.body.status).toBe("success");
            const loginRes = await logIn({
                "email": user.email,
                "password": user.password,
            })
            //console.log(loginRes.body);
            expect(loginRes.body.status).toBe("success");
            expect(loginRes.body.token).toBeDefined();
            expect(loginRes.body.data.user.name).toBe(user.name);
        });

        it('should login user - option 2 using then', async () => { // rewrite


            const signUpRes = await signUp(user);
            expect(signUpRes.body.status).toBe("success");
            const loginRes = await logIn({
                "email": user.email,
                "password": user.password,
            })

            expect(loginRes.body.status).toBe("success");
            expect(loginRes.body.token).toBeDefined();
            expect(loginRes.body.data.user.name).toBe(user.name);
        });

        it("login user option 3 using try and cathc", async () => {
            try{
                await signUp(user).then((el) => {
                    expect(el.body.status).toBe("success");
                })
                await logIn({
                    "email": user.email,
                    "password": user.password,
                }).then((el2) => {
                    expect(el2.body.status).toBe("success");
                })
            }
            catch(error){
                console.log("Error during login process", error)
            }
        })

        it("login user option 4 using then",  () => {

           signUp(user).then( res => {
               expect(res.body.status).toBe("success");
               return logIn({
                   "email": user.email,
                   "password": user.password
               }).then((res2) => {
                   expect(res2.statusCode).toBe(200);
               })
                   .catch(error => {
                       console.log( error)
                   })
           })

        })

        it('login user option 5 using .end without Promise', function(done) {
            signUp2(user).end( (err, res)=> {  // don't work on signUp because function thru new Promise()
                if(err) return done(err);
                expect(res.body.status).toBe("success");
                done();

            })
        })


    });

    describe('negative tests', () => {

        let user = getUser();  // ASK MICHAEL if it makes sence use beforeALL and AfterAll
        beforeAll( async() => {
            await signUp(user);
        })

        afterAll( async () => {
            await logIn(user);
            await request.delete("/users/deleteMe").send().set("Authorization", `Bearer ${process.env.JWT}`).then(del => {
                console.log("Deleted!!", del.body);
            });
        })

        it("get error when trying login without password - using .then()", async () => { // using async await

            await logIn({
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
                    expect(res4.body.message).toBe("Please provide email and password!");
                    done();
                })

        });

        it("get error when trying login with wrong password", (done) => {

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