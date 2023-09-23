import { Request, Response } from "express";
import fs from 'node:fs';
import { DATABASE_PATH } from "./database-path";
import { Database, Ticket, UserData } from "../types";
import { appError } from "./helpers/error.helper";
import * as fsHelpers from './helpers/fs.helper';
import { FsResponse } from "../models/fs-response.model";

const createTicketId = (tickets: Ticket[]): string => {
    let id: number = 1;
    tickets.forEach(ticket => {
        if (id < +ticket.id) {
            id = +ticket.id;
        }
        if (id === +ticket.id) {
            id +=1;
        }
    }); 
    return id.toString();
}

export const getAllTickets = (req: Request, res: Response) => {
    const { userid } = req.params;
    let database: Database;
    let response;

    fs.readFile(DATABASE_PATH, 'utf-8', (err, data) => {
        if (err) {
            // response = res.status(500).json(err.message);
            response = appError(err, res);
        };
        database = JSON.parse(data);
        const dbUser: UserData | undefined = database.users.find(user => user.id === userid);

        if (dbUser && dbUser.tickets.length > 0) {
            response = res.status(200).send(dbUser.tickets);  
        } else if (dbUser && dbUser.tickets.length < 1) {
            response = res.status(200).json('You have no tickets purchased');
        } else {
            response = res.status(404).json('User not found');
        }
    });

    return response;
}

export const makeReservation1 = (req: Request, res: Response) => {
    let database: Database;
    const requestBody = req.body;
    const { userid } = req.params;
    let response;

    const reserveTicket = (ticketToStore: Ticket, user: UserData) => {
        const isReserved: boolean = !user.tickets.some(ticket => ticket.flight.flightNumber === ticketToStore.flight.flightNumber); 
        const newTicket: Ticket = ticketToStore;
        newTicket.id = createTicketId(user.tickets);

        if (isReserved) {
            user.tickets.push(newTicket);
            // response = res.status(200).send(database);
            fs.writeFile(DATABASE_PATH, JSON.stringify(database) , 'utf-8', (err) => {
                if (err) {
                    // response = res.status(500).json(err.message);
                    response = appError(err, res);
                }
                response = res.status(200).json('Ticket reserved');
            });
        } else {
            response = res.status(400).json('You have already reserved this flight');
        }
    };

    fs.readFile(DATABASE_PATH, 'utf-8', (err, data) => {
        if (err) {
            response = appError(err, res);
            // response = res.status(500).json(`Oops, something went wrong`);
        };
        
        database = JSON.parse(data);
        const user: UserData | undefined = database.users.find(dbUser => dbUser.id === userid);
        
        if (user) {
            reserveTicket(requestBody, user);
        }
    });

    return response;
};

export const makeReservation = (req: Request, res: Response) => {
    const requestBody = req.body;
    const { userid } = req.params;
    let response;

    const fsResponse: FsResponse = fsHelpers.readDatabase();   
    if (fsResponse.errorCode) {
        response = appError({message: fsResponse.message}, res, fsResponse.errorCode);
        return response;
    }

    const database: Database = fsResponse.data;
    const user = database.users.find(foundUser => userid === foundUser.id);
    if (!user) {
        response = res.status(404).json('User not found');
        return response;
    }
    
    const alreadyReserved = user?.tickets.some(ticket => ticket.flight.flightNumber === requestBody.flight.flightNumber);

    if (alreadyReserved) {
        response = res.status(400).json('You have already reserved this flight');
    } else {
        user?.tickets.push(requestBody);
        requestBody.id = createTicketId(user!.tickets); // mora postojati response i ako ne postoji user ili db
        const updateRes: FsResponse = fsHelpers.updateDatabase(database, 'Ticket reserved');
        response = res.status(200).json(updateRes.message);
    };
    
    return response;
};

export const payTicket = (req: Request, res: Response) => {
    const { userid, ticketid } = req.params;
    let response;

    const fsResponse: FsResponse = fsHelpers.readDatabase();
    const database: Database = fsResponse.data;

    const user = database.users.find(foundUser => userid === foundUser.id);
    
    const ticketToUpdate: undefined | Ticket = user?.tickets.find(ticket => ticket.id === ticketid);

    if (ticketToUpdate && ticketToUpdate.status === 'paid') {
        response = res.status(200).json('Ticket was already paid');
    } else if (ticketToUpdate && ticketToUpdate.status !== 'paid') {
        ticketToUpdate.status = 'paid';
        ticketToUpdate.booked = false;
        ticketToUpdate.purchased = true;
        fsHelpers.updateDatabase(database, 'Ticket updated');
        response = res.status(200).json('Ticket paid');
    };
    
    return response;
};

export const refundTicket = (req: Request, res: Response) => {
    const { userid, ticketid } = req.params;
    let response;

    const fsResponse: FsResponse = fsHelpers.readDatabase();
    const database: Database = fsResponse.data;
    const user: undefined | UserData = database.users.find(foundUser => userid === foundUser.id);
    
    const ticketToDelete = user?.tickets.find(ticket => ticket.id === ticketid);

    if (user && ticketToDelete) {
        user.tickets = user.tickets.filter(ticket => ticket.id !== ticketid);
        // upisi u db
        fsHelpers.updateDatabase(database, 'Ticket removed');
        response = res.status(204).json('Ticket removed' );
    } else {
        response = res.status(404).json('No ticket found');
    };
    
    return response;
};