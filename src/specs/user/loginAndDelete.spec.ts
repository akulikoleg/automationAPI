import * as supertest from 'supertest';
import { getUser } from "../../data/user";
import {logIn, logIn2, signUp, deleteFunction, deleteFunction2} from "../../data/helpers";
const request = supertest("http://localhost:8001/api/v1");
import 'dotenv/config';


describe('user login', () => {

    describe("Positive testing",  () => {

        const user =  getUser();
        let cookie: [x:string]; // the same like let cookie: string;

        it('should delete user after login', async () => {
            let siqnRes = await signUp(user);
            let resLogin =  await logIn({
                email: user.email,
                password: user.password,
            });
            expect(resLogin.body.status).toBe("success");
            //console.log(resLogin);
            cookie = resLogin.headers["set-cookie"][0];
            let resDelete = await deleteFunction2(cookie);
            expect(resDelete.statusCode).toBe(204);
            expect(resDelete.ok).toBe(true);
            console.log(resDelete);

        })

    })


    describe("Negative testing", () => {


        const user = getUser();
        let cookie: [x: string]; // the same like let cookie: string;

        beforeEach( async () => {
            await signUp(user);
           const LoginRes = await logIn({
                email: user.email,
                password: user.password,
            });
           cookie = LoginRes.headers["set-cookie"][0];
        })

        it("can't delete user with invalid token -using async await", async () => {

            const delResp =   await deleteFunction("wrong");

             expect(delResp.statusCode).toBe(401);
             expect(delResp.body.status).toBe("fail");
             expect(delResp.body.message).toBe("You are not logged in! Please log in to get access.");


        })


        it("can't delete user with empty token", async () => {

            const delResp =   await request.delete("/users/deleteMe2")
                .send();

            expect(delResp.statusCode).toBe(401);
            expect(delResp.body.status).toBe("fail");
            expect(delResp.body.message).toBe("You are not logged in! Please log in to get access.");
        })

        it("can't delete user with invalid endpoint -using try and catch", async () => {

            try{
                 const delResp =   await request.delete("/users/deleteMe2")
                        .set("Cookie", cookie)
                        .send();
                    //console.log(delResp)
                    expect(delResp.statusCode).toBe(403);
                    expect(delResp.body.status).toBe("fail");
                    expect(delResp.body.message).toBe("You do not have permission to perform this action");
                //return delResp;

            }
            catch(err){
                throw new Error(`Error :  ${err}`);
            }
        })

        it("can't delete user with empty token - using try and catch", async () => {

            try{
                const delResp =   await request.delete("/users/deleteMe2").send();
                expect(delResp.statusCode).toBe(401);
                expect(delResp.body.status).toBe("fail");
                expect(delResp.body.message).toBe("You are not logged in! Please log in to get access.");
            }
            catch(err){
                throw new Error(`Test fail due to unexpected error ${err}`);
            }

        })

        it("Can't delete user with invalid token - using done",  (done) => {
            request.delete("/users/deleteMe")
                .set("Cookie", 'invalid_cookie')
                .send()
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.statusCode).toBe(401);
                    expect(res.body.status).toBe("fail");
                    expect(res.body.message).toBe("You are not logged in! Please log in to get access.");
                    done();
                })
        })

        it("can't delete user with empty token - using done()", (done) => {
            deleteFunction2(null)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.statusCode).toBe(401);
                    expect(res.body.status).toBe("fail");
                    expect(res.body.message).toBe("You are not logged in! Please log in to get access.");
                    done();
                })
        })

    })

})