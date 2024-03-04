import type { Express } from 'express';

import express from 'express';

import userRoutes from '../routes/User';
import authRoutes from '../routes/Auth';

const createServer = () => {
  const app: Express = express();

  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.use('/users', userRoutes);
  app.use('/auth', authRoutes);

  return app;
};

export default createServer;
