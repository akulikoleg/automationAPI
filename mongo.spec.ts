import * as supertest from 'supertest';
import {signUp} from "./src/data/helpers";
import {getUser} from "./src/data/user";
const request = supertest("http://localhost:8001/api/v1");
const {MongoClient, ObjectId} = require('mongodb');

const DATABASE_URL = "mongodb+srv://akulikoleg:040993@cluster0.n8gmu96.mongodb.net/";

describe("Mongo_DB",  () => {

    let connection;
    let db;

    beforeAll( async () => {
        try{
            connection = await MongoClient.connect(DATABASE_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            db = await connection.db();
        }catch(error) {
            console.error("Error connecting to MongoDB", error);
        }

    })

    afterAll( async () => {
        await connection.close();
    })

    it("should find the document", async () => {
        const users = db.collection("users");
        //console.log(users, "=======================users");
        const user = await users.findOne({name: "Verlie47"});
        console.log(user, "=======================user");
        expect(user.name).toEqual("Verlie47");
    })

    it.only("Verify that user was deleted in MongoDB", async () => {
        const userImport = getUser();
        try{
            const res = await signUp(userImport);
            // console.log(res.body, "================res===========");
            expect(res.statusCode).toBe(201);
            const users = db.collection("users");

            const userData = await users.findOne({name: userImport.name});
            if(!userData) {
                throw new Error("User does not exist in MONGODB");
            }
            expect(userData.name).toBe(userImport.name);
            expect(userData.email).toBe(userImport.email.toLowerCase());
            expect(userData.role).toBe("user");

            expect(userData._id.toString()).toEqual(res.body.data.user._id);
            let deleteData = await users.deleteOne({
                _id: new ObjectId(userData._id)
            })
            console.log(deleteData, "=========DeleteResp");
            expect(deleteData.deletedCount).toEqual(1);

        }catch (error){
            console.log("Error in user delete test");
        }



    })


});