import crypto from 'crypto';

const CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET;

export const basicVerification = async (req: Request) => {
  const httpMethod = 'GET';
  // @ts-expect-error get and originalUrl not available on Request
  const httpURI = `https://${req.get('host')}${req.originalUrl}`;

  const signature = req.headers['x-hubspot-signature'];
  const sourceString = CLIENT_SECRET + httpMethod + httpURI;
  const hash = crypto.createHash('sha256').update(sourceString).digest('hex');

  return hash == signature;
};
