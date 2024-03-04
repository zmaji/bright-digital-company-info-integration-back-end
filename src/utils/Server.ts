import type { Express } from 'express';

import express from 'express';

import installRoutes from '../routes/Install';
import userRoutes from '../routes/User';
import authRoutes from '../routes/Auth';

const createServer = () => {
  const app: Express = express();

  app.use(express.json());

  app.use('/', installRoutes);
  app.use('/users', userRoutes);
  app.use('/auth', authRoutes);

  return app;
};

export default createServer;
