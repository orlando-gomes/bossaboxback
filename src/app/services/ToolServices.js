import Tool from '../models/Tool';

class ToolServices {
  async fetchToolsByArrayOfIds(arrayOfIds) {
    const getToolsAsynchronously = async () =>
      Promise.all(
        arrayOfIds.map(async toolId => {
          const { id, title, link, description } = await Tool.findByPk(toolId);

          return { id, title, link, description };
        })
      );

    getToolsAsynchronously().then(arrayOfTools => {
      return arrayOfTools;
    });
  }
}

export default new ToolServices();
