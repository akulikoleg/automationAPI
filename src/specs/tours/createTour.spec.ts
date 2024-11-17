import * as supertest from 'supertest';
import {signUp, createTour, createTour2} from "../../data/helpers";
import {getUser, getUserWithRole} from "../../data/user";
import {tour} from "../../data/tour";
import {Tour} from "../../data/interface";
import {faker} from "@faker-js/faker";
const request = supertest("http://localhost:8001/api/v1");

describe('Tours', () => {

    describe("positive tests", () => {


        it("Create tour", async () => {
            let userImport = await getUserWithRole("admin");
            let tourImport = await tour();
            const signUpRes = await signUp(userImport);
            //console.log(signUpRes.body, "response");
            expect(signUpRes.body.status).toBe("success");
            const cookie = signUpRes.headers["set-cookie"];
            await request.post("/tours")
                .set("Cookie", cookie)
                .send(tourImport).then((el)=> {
                    console.log(el.body);
                    expect(el.body.status).toBe("success");
                })

        });

        it("Create tour - add try and catch", async () => {
           try{
               let userImport =  getUserWithRole("admin");
               let tourImport =   tour();
               const signUpRes = await signUp(userImport);
               //console.log(signUpRes.body, "response");
               expect(signUpRes.body.status).toBe("success");
               const cookie = signUpRes.headers["set-cookie"];
               await request.post("/tours")
                   .set("Cookie", cookie)
                   .send(tourImport).then((el)=> {
                       console.log(el.body);
                       expect(el.body.status).toBe("success");
                   })

           }catch(error){

               throw new Error("Error creating Tour: " + error.message);
           }


        });

        it("Create tour - using function", async () => {
          try{
               let tourImport =  tour();
               const createTourResponse = await createTour2("admin", tourImport);
               expect(createTourResponse.body.status).toBe("success");
               expect(createTourResponse.body.data.data.name).toEqual(tourImport.name);
           }catch(error){
               console.error("Error during create tour", error);
               throw new Error("Error creating Tour: " + error.message);
           }

        })

        it("Create tour - using function with lead-guide role", async () => {
            try{
                 let tourImport =  tour();
                const createTourResponse = await createTour2("lead-guide", tourImport); // incorrect because for feature test need to fetch id from signup separate
                expect(createTourResponse.body.status).toBe("success");
                expect(createTourResponse.body.data.data.name.trim()).toEqual(tourImport.name);
            }catch(error){
                throw new Error("Error creating Tour: " + error.message);
            }

        })

        //add one more positive test for  lead-guide role
    })

    describe("negative tests", () => {

        it('cannot create tour with incorrect role', async () => {
            try{
                let tourImport: Tour =  tour();
                const createTourResponse = await createTour2("user", tourImport);
                expect(createTourResponse.body.status).toBe("fail");
                expect(createTourResponse.body.message).toBe("You do not have permission to perform this action");
            }catch(error){
                throw new Error("Error creating Tour: " + error.message);
            }
        })

        it('cannot create tour without required field', async () => { // use one or maybe more && validation check on tour name size
            try{
                let tourImport = {
                    "name":faker.lorem.word({length:{min:10, max:40}}),
                    //"duration": 10,
                    "description":"Could be",
                    "maxGroupSize": 10,
                    "summary": "Test tour",
                    "difficulty": "medium",
                    "price": 1003,
                    "rating": 4.8,
                    "imageCover": "tour-3-cover.jpg",
                    "ratingsAverage": 4.9,
                    "guides":[],
                    "startDates":["2024-04-04"],
                    "location": {
                        "latitude": 40.712776,
                        "longitude": -74.005974,
                        "description": "Central Park, New York",
                        "address": "123 Park Ave, New York, NY 10001"
                    },
                    "startLocation": {
                        "coordinates": [-74.005974, 40.712776]
                    }
                };
                const createTourResponse = await createTour2("admin", tourImport);
                expect(createTourResponse.body.status).toBe("error");
                expect(createTourResponse.body.message).toBe('Tour validation failed: duration: A tour must have duration');
            }catch(error){
                throw new Error("Error creating Tour: " + error.message);
            }
        })

        it("cannot create tour when validation is not met", async () => {
            try{
                let tourImport = {
                    "name":faker.lorem.sentence({min:41, max:80}),
                    "duration": 10,
                    "description":"Could be",
                    "maxGroupSize": 10,
                    "summary": "Test tour",
                    "difficulty": "medium",
                    "price": 1003,
                    "rating": 4.8,
                    "imageCover": "tour-3-cover.jpg",
                    "ratingsAverage": 4.9,
                    "guides":[],
                    "startDates":["2024-04-04"],
                    "location": {
                        "latitude": 40.712776,
                        "longitude": -74.005974,
                        "description": "Central Park, New York",
                        "address": "123 Park Ave, New York, NY 10001"
                    },
                    "startLocation": {
                        "coordinates": [-74.005974, 40.712776]
                    }
                };
                const createTourResponse = await createTour2("admin", tourImport);
                expect(createTourResponse.body.status).toBe("error");
                expect(createTourResponse.body.error.message).toBe("Tour validation failed: name: A tour name must have less or equal then 40 characters");
                expect(createTourResponse.body.error.statusCode).toBe(500);
            }catch(error){
                throw new Error("Error creating Tour: " + error.message);
            }
        })

    })

})