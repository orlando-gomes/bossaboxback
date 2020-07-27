import { Router } from 'express';

import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../swagger.json';

import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import TagController from './app/controllers/TagController';
import ToolController from './app/controllers/ToolController';

const routes = new Router();

routes.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

routes.get('/', (req, res) => {
  return res.json({ msg: 'Bossaboxback on server again operating 100%!' });
});

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.show);
routes.put('/users', UserController.update);

routes.get('/tags', TagController.index);

routes.get('/tools', ToolController.index);
routes.get('/tools/:id', ToolController.show);
routes.post('/tools/', ToolController.store);
routes.delete('/tools/:id', ToolController.delete);

export default routes;
