import { Flight } from "../types";

export class Ticket {
    constructor(id: string, price: string, currency: string, status: string, expired: boolean, booked: boolean, purchased: boolean, flight: Flight) {
        this.id = id;
        this.price = price;
        this.currency = currency;
        this.status = status;
        this.expired = expired;
        this.booked = booked;
        this.purchased = purchased;
        this.flight = flight;
    }

    id;

    price;

    currency;

    status;

    booked;

    purchased;

    expired;

    flight;
}