import Sequelize, { Model } from 'sequelize';

class Tag extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Tag;
