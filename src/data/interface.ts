import {faker} from "@faker-js/faker";
import {difficulty} from "./tour";

export interface User {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    role?: string;
}

export interface Tour {
    name: string;
    slug?: string;
    duration: number;
    description?: string;
    maxGroupSize: number;
    summary: string;
    difficulty: string;
    price: number,
    rating?: number;
    priceDiscount?: number;
    imageCover: string,
    images?: string[],
    ratingsAverage: number,
    createdAt?: Date,
    guides?: [],
    startDates?: string[],
    secretTour? : boolean;
    startLocation?: {
        type: string,
        coordinates: number[],
    }
    locations?: [],
    reviews?: string
}

export interface Review{
    review: string;
    rating: number;
    tour: string;
    user: string;
}