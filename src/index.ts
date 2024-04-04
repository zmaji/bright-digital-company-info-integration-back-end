import type { Express } from 'express';

import logger from '../src/utils/Logger';
import createServer from './utils/Server';
import { initializeWebhook } from './utils/Webhook';

const startServer = async () => {
  const app: Express = createServer();
  const port = process.env.PORT || 3000;

  await initializeWebhook();
  
  app.listen(port, () => {
    logger.info(`Company.info integration back-end listening on port ${port}`);
  });
};

startServer();
