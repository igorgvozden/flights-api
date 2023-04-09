import { Router } from "express";
import * as bookingController from '../controllers/booking-controller';

export const bookingRouter = Router();

bookingRouter.route('/:userid/booking/')
    .get(bookingController.getUsersBookings)
    .post(bookingController.bookFlight);

bookingRouter.route('/:userid/booking/:flightnumber')
    .get(bookingController.getBookingByFlightNumber)
    .delete(bookingController.deleteFlight);
    