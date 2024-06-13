import type { Express } from 'express';

import cors from 'cors';
import express from 'express';
import installRoutes from '../routes/Install';
import authRoutes from '../routes/Auth';
import userRoutes from '../routes/Users';
import companyRoutes from '../routes/Companies';
import groupRoutes from '../routes/Groups';
import propertyRoutes from '../routes/Properties';
import webhookRoutes from '../routes/Webhooks';
import formRoutes from '../routes/Forms';
import fileRoutes from '../routes/Files';
import workflowRoutes from '../routes/Workflows';

const createServer = () => {
  const app: Express = express();

  app.use(express.json());
  app.use(cors());

  app.use('/', installRoutes);
  app.use('/auth', authRoutes);
  app.use('/users', userRoutes);
  app.use('/companies', companyRoutes);
  app.use('/groups', groupRoutes);
  app.use('/properties', propertyRoutes);
  app.use('/webhooks', webhookRoutes);
  app.use('/forms', formRoutes);
  app.use('/files', fileRoutes);
  app.use('/workflows', workflowRoutes);

  return app;
};

export default createServer;
