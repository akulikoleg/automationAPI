import {faker} from '@faker-js/faker';
import {Tour} from "./interface";

export function tour(): Tour{
    return {
        name: faker.lorem.word({ length: { min: 10, max: 40 }}),
        duration: faker.number.int(18),
        description: faker.commerce.productDescription(),
        maxGroupSize: faker.number.int(35),
        summary: faker.lorem.sentence(),
        difficulty: faker.helpers.enumValue(diffic),
        price: +faker.commerce.price({dec:0}),
        rating: faker.number.float({min:1, max:5}),
        imageCover: "tour-3-cover.jpg",
        ratingsAverage: faker.number.float({min:1, max:5}),
        guides: [],
        startDates: [faker.date.future({years: 2}).toString().slice(10)],
        startLocation: {
            type: "Point",
            coordinates: [faker.location.latitude({ max: 10, min: -10 }), faker.location.longitude({ max: 10, min: -10 })],
        }
    }
}

export function difficulty(){
    const array  = ['easy', 'medium', 'difficult'];
    const index = Math.floor(Math.random() * 3);
    return array[index];
}

enum diffic {easy='easy', medium='medium', difficult='difficult'}

//
// export function tour5(){
//     return {
//         name: faker.lorem.word({length:{min:10,max:40}}),
//         duration: faker.number.int(100),
//         description: faker.lorem.word({length:{min:5,max:9}}),
//         maxGroupSize: faker.number.int(20),
//         summary: faker.lorem.word({length:{min:5,max:10}}),
//         difficulty: difficulty(),
//         price: faker.number.int(300),
//         rating: faker.number.float({ min: 1.1, max: 4.9 }),
//         imageCover: "tour-3-cover.jpg",
//         ratingsAverage: faker.number.float({ min: 1, max: 5 }),
//         guides: [],
//         startDates: faker.date.between({ from: '2024-11-01T00:00:00.000Z', to: '2025-12-12T00:00:00.000Z'}),
//         startLocation: {
//             type: "Point",
//             coordinates: [faker.location.latitude({ max: 10, min: -10 }), faker.location.longitude({ max: 10, min: -10 })],
//         },
//     }
// }