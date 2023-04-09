import fs from 'node:fs';
import { DATABASE_PATH } from "../database-path"
import { Database, UserData } from '../../types';
import { FsResponse } from '../../models/fs-response.model';

export const readDatabase = (): FsResponse => {
    let response: FsResponse;
    try {
        const db = fs.readFileSync(DATABASE_PATH, 'utf-8');
        const database: Database = JSON.parse(db);
        response = new FsResponse(null, null, database);
    } catch (err: any) {
        response = new FsResponse(500, err.message);
    }
    return response;
}

export const readUser = (userId: string): FsResponse => {
    let response: FsResponse;
    try {
        const db = fs.readFileSync(DATABASE_PATH, 'utf-8');
        const database: Database = JSON.parse(db);
        const user: UserData | undefined = database.users.find(dbUser => dbUser.id === userId);

        response = new FsResponse(null, null, user);    
    } catch (err: any) {
        response = new FsResponse(500, err.message);
    }
    return response;
};

export const updateDatabase = (updatedDb: Database, messageUponSuccess: string): FsResponse => {
    let response: FsResponse;
    try {
        const fileToWrite = JSON.stringify(updatedDb)
        fs.writeFileSync(DATABASE_PATH, fileToWrite);
        response = new FsResponse(null, messageUponSuccess);
      } catch (err: any) {
        response = new FsResponse(500, err.message);
      }
      return response;
};