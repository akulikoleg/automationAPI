import {Review} from "./interface";
import {faker} from '@faker-js/faker';

export function getReview( UserId: string, tourId: string): Review{
    return {
        review: faker.lorem.sentence(10),
        rating: faker.number.int({min: 1, max:5}),
        tour: tourId,
        user: UserId
    }

}