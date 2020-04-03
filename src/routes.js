import { Router } from 'express';

import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../swagger.json';

const routs = new Router();

routs.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

routs.get('/', (req, res) => {
  return res.json({ msg: 'Hello world' });
});

export default routs;
