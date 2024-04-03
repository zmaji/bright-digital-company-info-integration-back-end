import type { Express } from 'express';

import logger from '../src/utils/Logger';
import createServer from './utils/Server';
import webHookController from '../src/controllers/Webhook'

const startServer = async () => {
  const app: Express = createServer();
  const port = process.env.PORT || 3000;

  const webHook = await webHookController.getWebHook();

  if (!webHook) {
    await webHookController.createWebHook('ROLLING_MINUTE', 10); 
  }

  const webHookSubscriptions = await webHookController.getSubcriptions();

  // @ts-ignore
  const hasDossierNumberSubscription = webHookSubscriptions.some(subscription => {
    return subscription.propertyName === 'dossier_number';
  });

  if (!hasDossierNumberSubscription) {
    logger.info('No subscription with dossier_number found..');
    await webHookController.createSubscription('dossier_number', true, 'company.propertyChange')
  }

  app.listen(port, () => {
    logger.info(`Company.info integration back-end listening on port ${port}`);
  });
};

startServer();
