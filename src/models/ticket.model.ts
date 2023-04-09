export class Ticket {
    constructor(id: string, flightNumber: string, price: string, currency: string, travelDate: string, status: string, complete: boolean) {
        this.id = id;
        this.flightNumber = flightNumber;
        this.price = price;
        this.currency = currency;
        this.travelDate = travelDate;
        this.status = status;
        this.complete = complete
    }

    id;

    flightNumber;

    price;

    currency;

    travelDate;

    status;

    complete;
}