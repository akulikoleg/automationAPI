import * as supertest from 'supertest'

const request = supertest("http://localhost:8001/api/v1");


export  function signUp2(user: string | object | undefined){
     return  request.post("/users/signup").send(user);
}


export async function signUp(user: string | object | undefined): Promise<any> {

    return new Promise((resolve, reject) => {
       request.post("/users/signup")
           .send(user)
           .end((err, res)=> {
               if (err) return reject(err);
               return resolve(res);
           });
    });

}
export function logIn2(user: object){
    return request.post("/users/login").send(user);
}

export  function  logIn( user: object ): Promise<any> {

    //await request.post("/users/login").send(user);
    return new Promise( (resolve, reject) => {
        request.post("/users/login")
            .send(user)
            .end( (err, res) => {
                if (err) return reject(err);
                return resolve(res);
            })
    })

}

export function deleteFunction(cookie: string): Promise<any> {
    return new Promise( (resolve, reject) => {
        request.delete("/users/deleteMe")
            .set("Cookie", cookie)
            .send()
            .end((err, res) => {
                if(err) return reject(err);
                else return resolve(res);
            })
    } )
}


export  function deleteFunction2(cookie: [x: string] | null) {
    return request.delete("/users/deleteMe")
            .set("Cookie", cookie)
            .send();
}

export async function findUserbyEmail(db, email)
{
    const user = await db.collection("users").findOne({"email" : email});
    if(user){
        console.log("User found:", user);

    }
    else{
        console.log(`No user with email: ${email} found`);
    }
}