import { Router } from 'express';

import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../swagger.json';

import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import TagController from './app/controllers/TagController';
import ToolController from './app/controllers/ToolController';

const routes = new Router();

routes.use(
  '/bossaboxback/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

routes.get('/bossaboxback/', (req, res) => {
  return res.json({
    msg: 'Bossaboxback on new server operating 100% with CI/CD!',
  });
});

routes.post('/bossaboxback/users', UserController.store);
routes.post('/bossaboxback/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/bossaboxback/users', UserController.index);
routes.get('/bossaboxback/users/:id', UserController.show);
routes.put('/bossaboxback/users', UserController.update);

routes.get('/bossaboxback/tags', TagController.index);

routes.get('/bossaboxback/tools', ToolController.index);
routes.get('/bossaboxback/tools/:id', ToolController.show);
routes.post('/bossaboxback/tools/', ToolController.store);
routes.delete('/bossaboxback/tools/:id', ToolController.delete);

export default routes;
