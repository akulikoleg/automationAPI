import { faker } from '@faker-js/faker';
import {User} from "./interface"

export function getUser(): User {
    const pass = faker.internet.password();
    return {

        name: faker.internet.username(),
        email: faker.internet.email(),
        password: pass,
        passwordConfirm: pass

    };
}

// export const users = faker.helpers.multiple(createRandomUser, {
//     count: 5,
// });


//may try use faker for email generation , and good to delete