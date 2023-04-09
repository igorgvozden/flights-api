import { Request, Response } from 'express';
import fs from 'node:fs';
import { v4 } from 'uuid';
import { Database, User, UserData } from '../types';
import { DATABASE_PATH } from './database-path';
import UsersData from '../models/user-data.model';

export const getUsers = (req: Request, res: Response) => {
    let response;
 
    fs.readFile(DATABASE_PATH, 'utf-8', (err, data) => {
        if(err) {
            response = res.status(500).json(err.message);
        };
        const database: Database = JSON.parse(data);
        const { users } = database;

        if (users.length < 1) {
            response = res.status(404).json('There are no users in Database');
        } else {
            response = res.status(200).send(users as UserData[]);
        }
    });
   
    return response;
};

export const getUser = (req: Request, res: Response) => {
    const { id } = req.params;

    let response;
 
    fs.readFile(DATABASE_PATH,'utf-8', (err, data) => {
        if(err) {
            response = res.status(500).json(err.message);
        };
        const database: Database = JSON.parse(data);
        const user = database.users.find(dbUser => dbUser.id === id)
        if (user) {
            response = res.status(200).send(user);
        } else {
            response = res.status(404).json('User not found');
        }
    });
   
    return response;
};

export const createNewUser = (req: Request, res: Response) => {
    let response;
    if (req.body) {
        const requestBody = req.body as User;
        
        let database: Database;
        
        const writeUser = (newUser: User) => {
            fs.writeFile(DATABASE_PATH, JSON.stringify(database), 'utf-8', (err) => {
                if(err) {
                    response = res.status(500).json(err.message);
                    // return new error - napravi neki objekat za err handle
                }
                response = res.status(201).send(newUser);
            });
        };

        fs.readFile(DATABASE_PATH, 'utf-8', (err, data) => {
            if(err) {
                response = res.status(500).json(err.message);
            };

            database = JSON.parse(data);
            
            const newUser = new UsersData(v4(), requestBody, [], []) as UserData;

            if (!database.users) {
                database.users = [];
            };
            database.users.push(newUser);
            writeUser(newUser.user);
        });


    } else {
        return res.status(400).send('Check user data and try again.');
    }
    return response;
};

export const editUser = (req: Request, res: Response) => {
    let response;

    let database: Database;
    const { id } = req.params;
    
    if (req.body) {// objekat sa korisnicki podacima koji treba upisati u local storage 
        const requestBody = req.body as User;

        const updateuser = () => {
            fs.writeFile(DATABASE_PATH, JSON.stringify(database), 'utf-8', (err) => {
                if(err) {
                    response = res.status(500).json(err.message);
                    // return new error - napravi neki objekat za err handle
                };
                response = res.status(201).json("User's info updated");
            }); 
        };

        fs.readFile(DATABASE_PATH,'utf-8', (err, data) => {
            if (err) {
                response = res.status(500).json(err.message);
            };
            database = JSON.parse(data);
            const dbUserData: UserData | undefined = database.users.find(dbUser => dbUser.id === id);
    
            if (dbUserData) {
                dbUserData.user = requestBody;
                updateuser();
            } else {
                response = res.status(404).json("User not found")
            }
        }); 
    } else {
        response = res.status(400).send('Check user data and try again.');
    }
    return response;
};

export const deleteUser = (req: Request, res: Response) => {
    let response;

    let database: Database;
    const { id } = req.params;
    
    const removeUser = () => {
        fs.writeFile(DATABASE_PATH, JSON.stringify(database), 'utf-8', (err) => {
            if(err) {
                response = res.status(500).json(err.message);
                // return new error - napravi neki objekat za err handle
            };
            response = res.status(204).json("User deleted");
        }); 
    };

    fs.readFile(DATABASE_PATH, 'utf-8', (err, data) => {
        if (err) {
            response = res.status(500).json(err.message);
        };
        database = JSON.parse(data);
        const userExists: boolean= database.users.some(dbUser => dbUser.id === id);
        
        if (userExists) {
            database.users = database.users.filter(dbUser => dbUser.id !== id);
            removeUser();
        } else {
            response = res.status(404).json("User not found")
        }
    }); 

    return response;
};