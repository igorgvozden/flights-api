import { Router } from "express";
import * as ticketsController from '../controllers/tickets-controller';

export const ticketsRouter = Router();

ticketsRouter.route('/:userid/tickets')
    .get(ticketsController.getAllTickets)
    .post(ticketsController.makeReservation);

ticketsRouter.route('/:userid/tickets/:ticketid')
    .get(ticketsController.payTicket)
    .delete(ticketsController.refundTicket);
    