import * as supertest from 'supertest'

const request = supertest("http://localhost:8001/api/v1");


// export async function signUp(user: string | object | undefined){
//     await request.post("/users/signup").send(user);
// }


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

export async function  logIn( user: object ): Promise<any> {

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

