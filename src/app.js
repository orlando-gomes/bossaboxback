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
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;

/* sem https local
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
*/

/* com HTTPS local
import './bootstrap';

import express from 'express';
import https from 'https';
import fs from 'fs';

import cors from 'cors';

import routes from './routes';

import './database/databaseLoader';

class App {
  constructor() {
    this.app = express();

    this.middlewares();

    this.routes();

    if (process.env.NODE_ENV === 'production') {
      const privateKey = fs.readFileSync(
        '/etc/letsencrypt/live/orlstechbacks.com/privkey.pem',
        'utf8'
      );
      const certificate = fs.readFileSync(
        '/etc/letsencrypt/live/orlstechbacks.com/fullchain.pem',
        'utf8'
      );
      const credentials = {
        key: privateKey,
        cert: certificate,
      };
      this.server = https.createServer(credentials, this.app).listen(443);
    } else {
      this.server = this.app;
    }
  }

  middlewares() {
    this.app.use(express.json());

    // Para conformidade com a politica de CORS dos navegadores
    if (process.env.NODE_ENV === 'production') {
      this.app.use(
        cors({ origin: 'https://modest-hodgkin-38008e.netlify.app' })
      );
    } else {
      this.app.use(cors());
    }

    // Em ambiente de produção, poderíamos setar
    // this.server.use(cors({ origin: 'https://meudominio.com.br' }));
  }

  routes() {
    this.app.use(routes);
  }
}

export default new App().server;
*/
