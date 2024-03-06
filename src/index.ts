import type { Express } from 'express';
import logger from '../src/utils/Logger';

import createServer from './utils/Server';

const app: Express = createServer();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`Company.info integration back-end listening on port ${port}`);
});
