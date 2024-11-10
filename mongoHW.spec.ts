import * as supertest from 'supertest';
import {deleteFunction, logIn, signUp} from "./src/data/helpers";
import {getUser} from "./src/data/user";
import 'dotenv/config';
import {findUserbyEmail} from "./src/data/helpers"
import {User} from "./src/data/interface";
import {faker} from "@faker-js/faker";

const request = supertest("http://localhost:8001/api/v1");
const {MongoClient, ObjectId} = require('mongodb');



describe("MongoDB", () => {
    let client, db, users_collection, importUser: User;

    beforeEach( async () => {
        importUser = getUser();
        try{
            client = new MongoClient(process.env.DB_URL);
            await client.connect({
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            db = client.db();
            users_collection = db.collection("users");


        }catch(error) {

            throw new Error("MongoDB connection error: "+ error.message);

        }

    })

    afterEach( async () => {
        await client.close();
    })

    describe("Positive tests", () => {


        it.skip("connect to MongoDB", async  () => {


            const user = await users_collection.findOne({"email": "mike6666@mail.com"})
            expect(user.email).toEqual("mike6666@mail.com");


        })

        it("new user can be found in DB after signup and removed after delete", async () => {

            try{

                await signUp(importUser);
               // const users_collection = db.collection("users");

                //Check if new user present in MongoDB
                const userFromDB = await users_collection.findOne({email: importUser.email.toLowerCase()});
                expect(userFromDB.name).toEqual(importUser.name);

                const logRes =  await logIn({email: importUser.email, password: importUser.password});
                const cookie = logRes.headers["set-cookie"][0];

                // Check if user removed from DB after delete api request
                await deleteFunction(cookie);
                const deletedUserFromDB = await users_collection.findOne({email: importUser.email.toLowerCase()});
                if(deletedUserFromDB == null){
                    console.log("user deleted successfully!!!");
                }
                else throw new Error("Problem with deleting user from Database");
            }catch(error){
                throw new Error("Error deleting user from Database:" + error);
            }

        })


    })

    describe("negative tests", () => {


        it("user not removed from DB after delete request with invalid token", async () => {
            try{

                await signUp(importUser);
               // const users_collection = db.collection("users");
                const loginRes = await logIn({email: importUser.email, password: importUser.password});

                //check if new user present in mongodb
                const userFromDB1 = await users_collection.findOne({email: importUser.email.toLowerCase()}); // don't work without await
                expect(userFromDB1.name).toEqual(importUser.name);

                const fakeCookie = faker.internet.jwt({ header: { alg: 'HS256' }});
                await deleteFunction(fakeCookie);

                //check if new user still present in mongodb
                const userFromDB2 = await users_collection.findOne({email: importUser.email.toLowerCase()}); // don't work without await
                expect(userFromDB2).not.toBeNull();


            }catch(err){
                throw new Error("Error due find and delete with fake cookie" + err);
            }

        })

        it("user can't be removed from DB with empty token", async () => {
            try{

                await signUp(importUser);
                // const users_collection = db.collection("users");
                const loginRes = await logIn({email: importUser.email, password: importUser.password});

                //check if new user present in mongodb
                const userFromDB1 = await users_collection.findOne({email: importUser.email.toLowerCase()}); // don't work without await
                expect(userFromDB1.name).toEqual(importUser.name);

                const fakeCookie = null;
                const deleteResponse = await deleteFunction(fakeCookie);

                //check if new user still present in mongodb
                const userFromDB2 = await users_collection.findOne({email: importUser.email.toLowerCase()}); // don't work without await
                expect(deleteResponse.statusCode).toEqual(401);
                expect(deleteResponse.body.message).toBe("You are not logged in! Please log in to get access.");
                expect(userFromDB2).not.toBeNull();



            }catch(err){
                throw new Error("Error on find and delete with empty cookie" + err);
            }

        })

    })

})