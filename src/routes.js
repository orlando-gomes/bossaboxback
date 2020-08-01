import { Router } from 'express';

import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../swagger.json';

import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import TagController from './app/controllers/TagController';
import ToolController from './app/controllers/ToolController';

const routes = new Router();

// that's for online server mapping by nginx
const addPath = process.env.NODE_ENV === 'production' ? '/bossaboxback' : '';

routes.use(
  `${addPath}/api-docs`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

routes.get(`${addPath}/`, (req, res) => {
  return res.json({
    msg: 'Bossaboxback on new server operating 100% with CI/CD!',
  });
});

routes.post(`${addPath}/users`, UserController.store);
routes.post(`${addPath}/sessions`, SessionController.store);

routes.use(authMiddleware);

routes.get(`${addPath}/users`, UserController.index);
routes.get(`${addPath}/users/:id`, UserController.show);
routes.put(`${addPath}/users`, UserController.update);

routes.get(`${addPath}/tags`, TagController.index);

routes.get(`${addPath}/tools`, ToolController.index);
routes.get(`${addPath}/tools/:id`, ToolController.show);
routes.post(`${addPath}/tools`, ToolController.store);
routes.delete(`${addPath}/tools/:id`, ToolController.delete);

export default routes;
