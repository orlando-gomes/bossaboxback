import Sequelize, { Model } from 'sequelize';

class Tooltag extends Model {
  static init(sequelize) {
    super.init(
      {
        toolid: Sequelize.INTEGER,
        tagid: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  // Add relationship to model ToolTag
  static associate(models) {
    this.belongsTo(models.Tool, { foreignKey: 'toolid', as: 'tool' });
    this.belongsTo(models.Tag, { foreignKey: 'tagid', as: 'tag' });
  }
}

export default Tooltag;
