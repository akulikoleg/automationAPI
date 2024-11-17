import { getUserWithRole} from "../../data/user";
import {createReview, createTour, getAllReviewsOfTour, signUp} from "../../data/helpers";
import * as supertest from "supertest";
import {tour} from "../../data/tour";
import {getReview} from "../../data/review";
import {faker} from "@faker-js/faker";
const request = supertest("http://localhost:8001/api/v1");

describe("Review", () => {

    describe
    ("Positive", () => {

        it("create review", async () => {
            let cookie;
            let userId, tourId;
            const userImport = getUserWithRole('admin');
            const tourImport =  tour();
            await signUp(userImport).then((el)=> {
                expect(el.body.status).toBe('success');
                //console.log(el, 'res');
                cookie = el.headers["set-cookie"];
                userId = el.body.data.user._id;

            })
            await request.post("/tours")
                .set("Cookie", cookie)
                .send(tourImport)
                .then((el) => {
                    console.log(el.body, "res" );
                    expect(el.body.status).toBe('success');
                    tourId = el.body.data.data.id;
                })

            await request.post("/reviews")
                .set("Cookie", cookie)
                .send({
                    review:"dsf",
                    rating: 3.9,
                    tour: tourId,
                    user: userId

                }).then( (el) => {
                    expect(el.statusCode).toBe(201);
                    expect(el.body.status).toBe('success');
                })
        })

        it("create review using functions", async () => {
          try{
              let cookie;
              let userId, tourId;
              const userImport = getUserWithRole('admin');
              const tourImport =  tour();

              await signUp(userImport).then( (el) => {
                  expect(el.body.status).toBe('success');
                  expect(el.statusCode).toBe(201);
                  userId = el.body.data.user._id;
                  cookie = el.headers["set-cookie"];
                  //console.log(cookie);
              })

              await createTour(cookie, tourImport).then( (el) => {
                  expect(el.body.status).toBe('success');
                  expect(el.statusCode).toBe(201);
                  //console.log(el.body);
                  tourId = el.body.data.data.id;
              })
              const testReview =  getReview(userId, tourId);
              await createReview(cookie, testReview ).then( (el ) => {
                  expect(el.statusCode).toBe(201);
                  console.log(el.body);
              })
          }catch(error){
              console.error(error.message);
          }

        });


        it("get all reviews per tour", async () => {
            // create user
            let userImport = getUserWithRole('admin');
            let tourImport =  tour();
            let userID,  cookie, tourId;
            await signUp(userImport).then( (el) => {
                expect(el.statusCode).toBe(201);
                userID = el.body.data.user._id;
                cookie = el.headers["set-cookie"];
            });
            // user with role admin create tour


            await createTour(cookie, tourImport ).then( (res) => {
                expect(res.statusCode).toBe(201);
                tourId = res.body.data.data.id;
            })
            // admin add review per tour
            const review = getReview(userID, tourId);
            await createReview(cookie, review ).then( (res) => {
                expect(res.statusCode).toBe(201);
            })
             // create 3 more reviews
            for(let i = 0; i  <3; i++)
            {
                let temp_userImport = getUserWithRole('user');
                let temp_userId;
                let temp_cookie;
                await signUp(temp_userImport).then( (el) => {
                    expect(el.statusCode).toBe(201);
                    userID = el.body.data.user._id;
                    temp_cookie = el.headers["set-cookie"];
                });
                let temp_review = getReview(temp_userId, tourId);
                await createReview(temp_cookie, temp_review ).then( (res) => {
                    expect(res.statusCode).toBe(201);
                })

            }

            // fetch all reviews should be one
            await getAllReviewsOfTour(tourId, cookie).then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body.results).toBe(res.body.data.data.length);
                console.log(res.body.data);
            })





        })


    })

    describe("Negative", () => {

        let userId, tourId;

        beforeAll(async () => {

            let userImport = getUserWithRole('admin');
            let tourImport =  tour();
            let cookie;

            await signUp(userImport).then((el)=> {
                //console.log(el, 'res');

                expect(el.body.status).toBe('success');

                cookie = el.headers["set-cookie"];
                userId = el.body.data.user._id;

            })
            await request.post("/tours")
                .set("Cookie", cookie)
                .send(tourImport)
                .then((el) => {
                   // console.log(el.body, "res" );
                    expect(el.body.status).toBe('success');
                    tourId = el.body.data.data.id;
                })
        })

        it("Cannot create review then role is guide", async () => {

            try{
                let temp_cookie;
                let temp_userId, tempTourID;
                const testUser = getUserWithRole('guide');


                await signUp(testUser).then( (el) => {
                    expect(el.body.status).toBe('success');
                    expect(el.statusCode).toBe(201);
                    temp_userId = el.body.data.user._id;
                    temp_cookie = el.headers["set-cookie"];
                    //console.log(cookie);
                })

                const testReview =  getReview(temp_userId, tourId);
                await createReview(temp_cookie, testReview ).then( (el ) => {
                    console.log(el.body);
                    expect(el.statusCode).toBe(403);
                    expect(el.body.message).toBe("You do not have permission to perform this action");


                })
            }catch(error){
               throw new Error(error.message);
            }

        })


        it("Cannot create review then role is lead-guide", async () => {
            try{
                let temp_cookie;
                let temp_userId, tempTourID;
                const testUser = getUserWithRole('lead-guide');


                await signUp(testUser).then( (el) => {
                    expect(el.body.status).toBe('success');
                    expect(el.statusCode).toBe(201);
                    temp_userId = el.body.data.user._id;
                    temp_cookie = el.headers["set-cookie"];
                    //console.log(cookie);
                })

                const testReview =  getReview(temp_userId, tourId);

                await createReview(temp_cookie, testReview ).then( (el ) => {
                   // console.log(el.body);
                    expect(el.statusCode).toBe(403);
                    expect(el.body.message).toBe("You do not have permission to perform this action");


                })
            }catch(error){
                throw new Error(error.message);
            }
        })

        it("Cannot create review then missing userId",async ()=> {
            try{
                let temp_cookie;
                let temp_userId;
                const testUser = getUserWithRole('guide');


                await signUp(testUser).then( (el) => {
                    expect(el.body.status).toBe('success');
                    expect(el.statusCode).toBe(201);
                    temp_userId = el.body.data.user._id;
                    temp_cookie = el.headers["set-cookie"];
                    //console.log(cookie);
                })

                const testReview =  getReview(temp_userId, tourId);
                await createReview(temp_cookie, testReview ).then( (el ) => {
                    console.log(el.body);
                    expect(el.statusCode).toBe(403);
                    expect(el.body.message).toBe("You do not have permission to perform this action");


                })
            }catch(error){
                throw new Error(error.message);
            }
        })

        it("Cannot create review then missing tourId", async ()=> {

                        let temp_cookie;
                        let temp_userId;
                        const testUser = getUserWithRole('user');

                        await signUp(testUser).then( (el) => {
                            expect(el.body.status).toBe('success');
                            expect(el.statusCode).toBe(201);
                            temp_userId = el.body.data.user._id;
                            temp_cookie = el.headers["set-cookie"];
                            //console.log(cookie);
                        })

                        const testReview2 = {
                            "review":"My new Tour  dfgfdReview",
                            // "tour":"673979d40f278d3ca0ad976f",
                            "user":temp_userId,
                            "rating": 4
                        }

                        await createReview(temp_cookie, testReview2 ).then( (el ) => {
                            console.log(el.body);
                            expect(el.statusCode).toBe(500);
                            expect(el.body.message).toBe("Review validation failed: tour: Review must belong to a tour");
                        })


        })

        it("Cannot create review then missing review", async ()=> {

            let temp_cookie;
            let temp_userId;
            const testUser = getUserWithRole('user');

            await signUp(testUser).then( (el) => {
                expect(el.body.status).toBe('success');
                expect(el.statusCode).toBe(201);
                temp_userId = el.body.data.user._id;
                temp_cookie = el.headers["set-cookie"];
                //console.log(cookie);
            })

            const testReview2 = {
               // "review":"My new Tour  dfgfdReview",
                tour: tourId,
                user: temp_userId,
                rating: 4
            }

            await createReview(temp_cookie, testReview2 ).then( (el ) => {
                console.log(el.body);
                expect(el.statusCode).toBe(500);
                expect(el.body.message).toBe("Review validation failed: review: Review cannot be empty");
            })
        })


        it.failing("Cannot create review then missing rating", async ()=> {

            let temp_cookie;
            let temp_userId;
            const testUser = getUserWithRole('user');

            await signUp(testUser).then( (el) => {
                expect(el.body.status).toBe('success');
                expect(el.statusCode).toBe(201);
                temp_userId = el.body.data.user._id;
                temp_cookie = el.headers["set-cookie"];
                //console.log(cookie);
            })

            const testReview2 = {
                review: "My new Tour  dfgfdReview",
                tour: tourId,
                user: temp_userId,
               // rating: 4
            }

            await createReview(temp_cookie, testReview2 ).then( (el ) => {
                console.log(el.body);
                expect(el.statusCode).toBe(500);
                expect(el.body.message).toBe("Rating validation failed: review: raiting field is required");
            })
        })

    })

})