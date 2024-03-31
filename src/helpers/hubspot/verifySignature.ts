import { Request } from 'express';
import * as crypto from 'crypto';
import logger from '../../utils/Logger';

const HUBSPOT_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET;

// TODO: Type
// eslint-disable-next-line
export const verifySignature = (req: Request): any => {
  try {
    const timestamp: string | undefined = req.headers['x-hubspot-request-timestamp'] as string | undefined;
    const signature: string | undefined = req.headers['x-hubspot-signature-v3'] as string | undefined;

    // const requestBody: string = req.rawBody.toString();
    const requestBody: string = JSON.stringify(req.body);
    const requestMethod: string = req.method;
    const requestUri: string = `https://${req.get('host')}${req.originalUrl}`;

    const ageThreshold: number = 300000;
    const age: number = Math.abs(Date.now() - Number(timestamp || 0));

    const decodedUri: string = decodeURIComponent(requestUri);
    const concatenation: string = requestMethod + decodedUri + requestBody + timestamp;

    if (age > ageThreshold) {
      logger.error('Timestamp of incoming HubSpot webhook is too old, rejecting request');

      return false;
    }

    if (HUBSPOT_CLIENT_SECRET && signature) {
      const hmac: crypto.Hmac = crypto.createHmac('sha256', HUBSPOT_CLIENT_SECRET);
      hmac.update(concatenation, 'utf-8');
      const hash: string = hmac.digest('base64');

      if (crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature))) {
        logger.info(`Valid signature for incoming request, proceeding..`);

        return true;
      } else {
        logger.info(`Invalid signature for incoming request, rejected!`);

        return false;
      }
    } else {
      logger.warn('No environment variable set');

      return false;
    }
  } catch (error) {
    logger.error('Error during signature verification:', error);
    throw error;
  }
};
