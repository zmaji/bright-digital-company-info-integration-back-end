import type { Express } from 'express';

import express from 'express';

import installRoutes from '../routes/Install';
import authRoutes from '../routes/Auth';
import userRoutes from '../routes/Users';
import companyRoutes from '../routes/Companies';
import webhookRoutes from '../routes/Webhooks';

const createServer = () => {
  const app: Express = express();

  app.use(express.json());

  app.use('/', installRoutes);
  app.use('/auth', authRoutes);
  app.use('/users', userRoutes);
  app.use('/companies', companyRoutes);
  app.use('/webhooks', webhookRoutes);

  return app;
};

export default createServer;
