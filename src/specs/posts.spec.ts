import * as supertest from 'supertest';

const request = supertest('https://jsonplaceholder.typicode.com/');


describe('POST /posts', () => {

    it("Create a new post", async () => {

      const res =  await request.post('/posts')
            .send({
                "userId": 123,
                "title": "testAutomate",
                "body": "test test test",

            }).expect(201);
        console.log(res.body);
        expect(res.body.userId).toBe(123);
        expect(res.body.title).toBe("testAutomate");
        expect(res.body.body).toBe("test test test");
    })

});






