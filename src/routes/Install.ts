import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';

const router = Router();

dotenv.config();

const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID;
const HUBSPOT_REDIRECT_URL = process.env.HUBSPOT_REDIRECT_URL;
const HUBSPOT_SCOPE = process.env.HUBSPOT_SCOPE;

const authURL = `https://app-eu1.hubspot.com/oauth/authorize?client_id=${HUBSPOT_CLIENT_ID}&redirect_uri=${HUBSPOT_REDIRECT_URL}&scope=${HUBSPOT_SCOPE}`

router.get('/', async (req: Request, res: Response) => {
  try {
    res.send(`<h2>HubSpot OAuth 2.0 Quickstart App</h2><a href="/install"><h3>Install the Company.info integration app</h3></a>`);
  } catch (error) {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal server error' });
  }
});

router.get('/install', async (req: Request, res: Response) => {
  try {
    console.log('Initializing new HubSpot installation..');
    res.redirect(authURL);
  } catch (error) {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal server error' });
  }
});

export default router;
