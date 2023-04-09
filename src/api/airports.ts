import { Router } from 'express';
import { airports } from '../data/airports';

export const airportRouter = Router();

function validAirportRegex(code: string) {
  const matchedCodes = code.match(/^[A-Z]{3}$/gi);
  return matchedCodes?.[0] === code;
}

airportRouter.get('/:code', (req, res) => {
  // const { code } = req.query;
  const { code } = req.params;
  if (code && !validAirportRegex(code.toString())) {
    res.status(400).json('Please enter a valid flight code i.e. DFW, GSO, ATL...');
  }

  const airport = airports.find((port) => port.code.toLowerCase() === code.toString().toLowerCase());

  if (airport) {
    res.json(airport);
  } else {
    res.status(404).json('Airport not found');
  }
});

airportRouter.get('/', (req, res) => {
  res.json(airports);
});
