import { faker } from '@faker-js/faker';


export function getUser(){
    const pass = faker.internet.password();
    return {

        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: pass,
        passwordConfirm: pass

    };
}

// export const users = faker.helpers.multiple(createRandomUser, {
//     count: 5,
// });


//may try use faker for email generation , and good to delete