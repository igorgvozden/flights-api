import { Response } from "express";

export const appError = (err: any,  res: Response, errCode?: number,) => {
    const error = err || { message: 'Ooops, something went wrong' };
    const statusCode = errCode || 500;

    return res.status(statusCode).json(error.message) as Response;
}