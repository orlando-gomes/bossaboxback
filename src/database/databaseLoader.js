import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import Tag from '../app/models/Tag';
import Tool from '../app/models/Tool';
import Tooltag from '../app/models/Tooltag';

const models = [User, Tag, Tool, Tooltag];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
