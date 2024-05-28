import crypto from 'crypto';

const CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET;

export const basicVerification = (req) => {
  const httpMethod = 'GET';
  const httpURI = `https://quoratio-crm-card.herokuapp.com/hubspot${req.url}`;

  const signature = req.headers['x-hubspot-signature'];
  const sourceString = CLIENT_SECRET + httpMethod + httpURI;
  const hash = crypto.createHash('sha256').update(sourceString).digest('hex');

  return hash == signature;
};
