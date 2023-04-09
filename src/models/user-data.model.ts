import { Flight, Ticket, User } from "../types";

class UserData {
    constructor(id: string, user: User, bookings: Flight[], tickets: Ticket[]) {
        this.id = id;
        this.user = user;
        this.bookings = bookings;
        this.tickets = tickets;
    }

    id;

    user;

    bookings;
    
    tickets;
}

export default UserData;