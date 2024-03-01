import type { Express } from 'express';

import express from 'express';
import userRoutes from '../routes/User';

const createServer = () => {
  const app: Express = express();

  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.use('/users', userRoutes);

  return app;
};

export default createServer;
