import * as supertest from 'supertest';
import {signUp} from "../../data/helpers";
import {getUser, getUserWithRole} from "../../data/user";
import {tour} from "../../data/tour";
const request = supertest("http://localhost:8001/api/v1");

describe('Tours', () => {
    describe("positive tests", () => {
        it("Create tour", async () => {
            let userImport = await getUserWithRole("admin");
            let tourImport = await tour();
            const signUpRes = await signUp(userImport);
            console.log(signUpRes.body, "response");
            expect(signUpRes.body.status).toBe("success");
            const cookie = signUpRes.headers["set-cookie"];
            await request.post("/tours")
                .set("Cookie", cookie)
                .send(tourImport).then((el)=> {
                    console.log(el.body);
                    expect(el.body.status).toBe("success");
                })

        });  // add try / catch


        //add one more positive test for  lead-guide role
    })

    //negative tests
    it('cannot create tour with incorrect role', () => { // user guide

    })

    it('cannot create tour without required field', () => { // use one or maybe more && validation check on tour name size

    })

    it("cannot create tour when validation is not met", () => {

    })









})