import * as supertest from 'supertest';
import { getUser } from "../../data/user";
import {logIn, signUp, signUp2} from "../../data/helpers";
const request = supertest("http://localhost:8001/api/v1");

describe('LOGIN', () => {

    // afterEach( async () => {
    //     await request.delete("/deleteMe").send();
    // })
// ask Michael about too many request
    describe('positive testing', () => {

        let user = getUser();//make it before each

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

        it.only('login user option 5 using .end without Promise', function(done) {
            signUp2(user).end( (err, res)=> {  // don't work on signUp because function thru new Promise()
                if(err) return done(err);
                expect(res.body.status).toBe("success");
                done();

            })
        })


    });

    describe('negative tests', () => {

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