import './bootstrap';

import express from 'express';

import cors from 'cors';

import routes from './routes';

import './database/databaseLoader';

class App {
  constructor() {
    this.server = express();

    this.middlewares();

    this.routes();
  }

  middlewares() {
    this.server.use(express.json());

    // Para conformidade com a politica de CORS dos navegadores
    if (process.env.NODE_ENV === 'production') {
      this.server.use(
        cors({ origin: 'https://modest-hodgkin-38008e.netlify.app' })
      );
    } else {
      this.server.use(cors());
    }

    // Em ambiente de produção, poderíamos setar
    // this.server.use(cors({ origin: 'https://meudominio.com.br' }));
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
