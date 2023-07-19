/* istanbul ignore file */
import express from 'express';
import cors from 'cors';
import { env } from './env';
import { logger } from './logger';
import { flights } from './api/flights';
import { airportRouter } from './api/airports';
import { userRouter } from './api/user';
import { ticketsRouter } from './api/tickets';
import { bookingRouter } from './api/booking';

const port = env.port || '4000';

const app = express();

app.use(cors({
  credentials: true,
  origin: ['http://localhost:4000', 'http://localhost:4200'] // [server-adresa, production-adresa]
}));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");    
  next();
});
app.use(express.json());

app.get('/', (_: express.Request, res: express.Response) => {
  res.send('👋');
});

app.use('/flights', flights);

app.use('/airports', airportRouter);

app.use('/users', userRouter);
app.use('/users', bookingRouter);
app.use('/users', ticketsRouter);

app.listen(port, () => {
  logger.notice(`🚀 Listening at http://localhost:${port}`);
});
