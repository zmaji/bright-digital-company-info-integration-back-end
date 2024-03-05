import type { Express } from 'express';

import createServer from './utils/Server';

const app: Express = createServer();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Company.info intgration back-end listening on port ${port}`);
});
