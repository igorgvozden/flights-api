import { Request, Response } from 'express';
import fs from 'node:fs';
import { Database, Flight, UserData } from '../types';
import{ DATABASE_PATH } from './database-path';

export const getUsersBookings = (req: Request, res: Response) => {
    let response;
    const { userid } = req.params;
    let database: Database;

    fs.readFile(DATABASE_PATH, 'utf-8', (err, data) => {
        if (err) {
            response = res.status(500).send('Oops, something went wrong..');
        };
        database = JSON.parse(data);
        const dbUser: UserData | undefined = database.users.find(user => user.id === userid);

        if (dbUser && dbUser.bookings.length > 0) {
            response = res.status(200).send(dbUser.bookings);  
        } else if (dbUser && dbUser.bookings.length < 1) {
            response = res.status(200).json('Nothing booked yet');
        } else {
            response = res.status(404).json('User not found');
        }
    });
    return response;
};

export const bookFlight = (req: Request, res: Response) => {
    let database: Database;
    const requestBody = req.body;
    const { userid } = req.params;
    let response;

    const storeFlight = (flightToStore: any, user: UserData) => {
        const isAllowedToBook: boolean = !user.bookings.some(bookedFlight => bookedFlight.flightNumber === flightToStore.flightNumber); 

        if (isAllowedToBook) {
            user.bookings.push(flightToStore);
            // response = res.status(200).send(database);
            fs.writeFile(DATABASE_PATH, JSON.stringify(database) , 'utf-8', (err) => {
                if (err) {
                    response = res.status(500).json(err.message);
                }
                response = res.status(200).json('Flight booked');
            });
        } else {
            response = res.status(400).json('Flight was already booked');
        }
    };

    fs.readFile(DATABASE_PATH, 'utf-8', (err, data) => {
        if (err) {
            response = res.status(500).json(`Oops, something went wrong`);
        };
        
        database = JSON.parse(data);
        const user: UserData | undefined = database.users.find(dbUser => dbUser.id === userid);
        
        if (user) {
            storeFlight(requestBody, user);
        }
    });

    return response;
};

export const getBookingByFlightNumber = (req: Request, res: Response) => {
    let response;
    const { userid, flightnumber } = req.params;
    let database: Database;

    fs.readFile(DATABASE_PATH, 'utf-8', (err, data) => {
        if (err) {
            response = res.status(500).send('Oops, something went wrong');
        };
    
        database = JSON.parse(data);
        const user: UserData | undefined = database.users.find(dbUser => dbUser.id === userid);

        if (user) {
            const searchedFlight: Flight | undefined = user.bookings.find(flight => flight.flightNumber.toString() === flightnumber);

            if (searchedFlight) {
                res.status(200).send(searchedFlight);
            } else {
                response = res.status(404).json('No such Flight Number')
            }
        }

    });

    return response;
};

export const deleteFlight = (req: Request, res: Response) => {
    let response;
    const { userid, flightnumber } = req.params;
    let database: Database;

    const removeFromDb = () => {
        fs.writeFile(DATABASE_PATH, JSON.stringify(database), (err) => {
            if (err) {
                response = res.status(500).send('Oops, something went wrong');
            }
            response = res.status(204).json('Flight deleted');
        });
    };

    fs.readFile(DATABASE_PATH, 'utf-8', (err, data) => {
        if (err) {
            response = res.status(500).send('Oops, something went wrong');
        };
    
        database = JSON.parse(data);
        const user: UserData | undefined = database.users.find(dbUser => dbUser.id === userid);

        if (user) {
            const searchedFlight: Flight | undefined = user.bookings.find(flight => flight.flightNumber.toString() === flightnumber);

            if (searchedFlight) {
                const notDeletedFlights = user.bookings.filter(flight => flight.flightNumber.toString() !== flightnumber);
                user.bookings = notDeletedFlights;
                
                removeFromDb();
            } else {
                response = res.status(404).json('No such Flight Number')
            }
        }

    });

    return response;
};