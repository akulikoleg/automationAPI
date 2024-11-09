import * as supertest from 'supertest';
import {deleteFunction, logIn, signUp} from "./src/data/helpers";
import {getUser} from "./src/data/user";
import 'dotenv/config';
import {findUserbyEmail} from "./src/data/helpers"
import {User} from "./src/data/interface";

const request = supertest("http://localhost:8001/api/v1");
const {MongoClient, ObjectId} = require('mongodb');



describe("MongoDB", () => {
    let client, db;

    beforeEach( async () => {
       try{
           client = new MongoClient(process.env.DB_URL);
           await client.connect({
               useNewUrlParser: true,
               useUnifiedTopology: true
           });
           db = client.db();

       }catch(error) {

           throw new Error("MongoDB connection error: "+ error.message);

       }

    })

    afterEach( async () => {
        await client.close();
    })

    it.skip("connect to MongoDB", async  () => {

        const users_collection = db.collection("users");
        const user = await users_collection.findOne({"email": "mike6666@mail.com"})
        expect(user.email).toEqual("mike6666@mail.com");


    })

    it("new user can be found in DB after signup and removed after delete", async () => {
        try{
            const importUser: User = getUser();
            await signUp(importUser);
            const users_collection = db.collection("users");


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

    // TO do the same 2 tests for negative scenarious;


    // it("user deleted from mongodb after delete thru API", () => {
    //
    // })

})